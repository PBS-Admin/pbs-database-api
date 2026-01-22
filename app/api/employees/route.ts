import { NextRequest } from "next/server";
import { personPool } from "@/app/db/connection";
import { RowDataPacket } from "mysql2/promise";

export interface IEmployee extends RowDataPacket {
  id: number;
  FullName: string;
  Initials: string;
  LogInName: string;
  Active: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const [rows] = await personPool.query<IEmployee[]>(
      "SELECT ID, FullName, Initials, LogInName  FROM `Employees` WHERE `Active` = 1 LIMIT 10",
    );

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
}
