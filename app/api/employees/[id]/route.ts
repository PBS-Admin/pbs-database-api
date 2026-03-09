import { NextRequest } from "next/server";
import { personPool } from "@/app/db/connection";
import { IEmployee } from "../route";
import { validateRequest, okResponse, failResponse } from "@/app/lib/apiAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await validateRequest(request);
  if (!auth.valid) return auth.response;

  const id = (await params).id;

  try {
    const [rows] = await personPool.query<IEmployee[]>(
      "SELECT ID, FullName, Initials, LogInName FROM Employees WHERE ID = ? LIMIT 1",
      [id],
    );

    if (rows.length === 0) {
      return failResponse("Not Found", `No employee found with ID '${id}'.`, 404);
    }

    return okResponse("GETEMPLOYEE", rows[0], "Record Retrieved");
  } catch (err) {
    console.error("GET /api/employees/[id] error:", err);
    return failResponse("Internal Server Error", "An unexpected error occurred.", 500);
  }
}
