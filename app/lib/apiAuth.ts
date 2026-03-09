import { NextRequest, NextResponse } from "next/server";

// ── Types ──────────────────────────────────────────────────────────────

export interface ParsedRequest {
  valid: true;
  apiKey: string;
  apiVersion: string;
  requestType?: string;
  data1?: Record<string, any>;
}

interface InvalidRequest {
  valid: false;
  response: NextResponse;
}

type RequestResult = ParsedRequest | InvalidRequest;

// ── Helpers ────────────────────────────────────────────────────────────

function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// ── Response builders ──────────────────────────────────────────────────

export function okResponse(
  requestType: string,
  data: any,
  message: string = "Success",
  status: number = 200,
) {
  return NextResponse.json(
    {
      requeststatus: `OK - ${message}`,
      requesttype: requestType,
      data1: data,
    },
    { status },
  );
}

export function failResponse(
  message: string,
  internalissues: string | null = null,
  status: number = 400,
) {
  return NextResponse.json(
    {
      requeststatus: `FAIL - ${message}`,
      internalissues: internalissues ?? message,
    },
    { status },
  );
}

// ── Request validation ─────────────────────────────────────────────────

const CURRENT_API_VERSION = process.env.API_VERSION ?? "1.0";

function validateApiKey(apiKey: string): boolean {
  const validKeys = (process.env.API_KEYS ?? "").split(",").map((k) => k.trim()).filter(Boolean);
  return validKeys.some((key) => secureCompare(apiKey, key));
}

/**
 * Validate an incoming request.
 *
 * GET  – reads APIKEY and APIVERSION from query parameters.
 * POST – reads APIKEY, APIVERSION, REQUESTTYPE, and DATA1 from
 *        x-www-form-urlencoded body (or JSON body as fallback).
 */
export async function validateRequest(
  request: NextRequest,
): Promise<RequestResult> {
  let apiKey = "";
  let apiVersion = "";
  let requestType: string | undefined;
  let data1: Record<string, any> | undefined;

  if (request.method === "GET") {
    apiKey = request.nextUrl.searchParams.get("APIKEY") ?? "";
    apiVersion = request.nextUrl.searchParams.get("APIVERSION") ?? "";
  } else {
    // POST / PUT / PATCH – read from body
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      apiKey = (formData.get("APIKEY") as string) ?? "";
      apiVersion = (formData.get("APIVERSION") as string) ?? "";
      requestType = (formData.get("REQUESTTYPE") as string) ?? undefined;

      const rawData1 = formData.get("DATA1") as string | null;
      if (rawData1) {
        try {
          data1 = JSON.parse(rawData1);
        } catch {
          return {
            valid: false,
            response: failResponse(
              "Invalid DATA1",
              "DATA1 must be a valid JSON string.",
            ),
          };
        }
      }
    } else {
      // JSON body fallback
      try {
        const body = await request.json();
        apiKey = body.APIKEY ?? "";
        apiVersion = body.APIVERSION ?? "";
        requestType = body.REQUESTTYPE ?? undefined;
        data1 = body.DATA1 ?? undefined;
      } catch {
        return {
          valid: false,
          response: failResponse(
            "Invalid Request Body",
            "Could not parse request body. Send x-www-form-urlencoded or JSON.",
          ),
        };
      }
    }
  }

  // Validate required fields
  if (!apiKey) {
    return {
      valid: false,
      response: failResponse("Invalid API Key", "APIKEY is required.", 401),
    };
  }

  if (!validateApiKey(apiKey)) {
    return {
      valid: false,
      response: failResponse("Invalid API Key", "The provided API Key is not valid.", 401),
    };
  }

  if (!apiVersion) {
    return {
      valid: false,
      response: failResponse("Invalid API Version", "APIVERSION is required."),
    };
  }

  if (apiVersion !== CURRENT_API_VERSION) {
    return {
      valid: false,
      response: failResponse(
        "Invalid API Version",
        `Unsupported APIVERSION '${apiVersion}'. Current version is '${CURRENT_API_VERSION}'.`,
      ),
    };
  }

  return { valid: true, apiKey, apiVersion, requestType, data1 };
}
