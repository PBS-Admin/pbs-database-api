import { NextRequest } from "next/server";
import { compPool } from "@/app/db/connection";
import { RowDataPacket } from "mysql2";

export interface ICompJob extends RowDataPacket {
  id: number;
  QuoteNumber: string;
  QuoteRev: number;
  JobNumber: string;
  Customer: string;
  ProjectName: string;
  SalesPerson: number;
}

export async function GET(request: NextRequest) {
  try {
    const [rows] = await compPool.query<ICompJob[]>(
      "SELECT ID, QuoteNumber, QuoteRev, JobNumber, Customer, ProjectName, SalesPerson FROM Jobs WHERE ACTIVE = 1 LIMIT 10",
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
