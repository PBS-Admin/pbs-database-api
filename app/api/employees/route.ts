import { NextRequest } from "next/server";
import { personPool } from "@/app/db/connection";
import { RowDataPacket } from "mysql2/promise";
import { validateRequest, okResponse, failResponse } from "@/app/lib/apiAuth";

export interface IEmployee extends RowDataPacket {
  id: number;
  FullName: string;
  Initials: string;
  LogInName: string;
  Active: boolean;
}

export async function GET(request: NextRequest) {
  const auth = await validateRequest(request);
  if (!auth.valid) return auth.response;

  try {
    const [rows] = await personPool.query<IEmployee[]>(
      "SELECT ID, FullName, Initials, LogInName FROM `Employees` WHERE `Active` = 1 LIMIT 10",
    );

    return okResponse("GETEMPLOYEES", rows, "Records Retrieved");
  } catch (err) {
    console.error("GET /api/employees error:", err);
    return failResponse("Internal Server Error", "An unexpected error occurred.", 500);
  }
}
