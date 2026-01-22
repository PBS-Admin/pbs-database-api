import { NextRequest } from "next/server";
import { salesPool } from "@/app/db/connection";
import { RowDataPacket } from "mysql2";

export interface IQuote extends RowDataPacket {
  id: number;
  AdjutantID: number;
  Quote: number;
  Customer: string;
  ProjectName: string;
  SalesPerson: number;
}

export async function GET(request: NextRequest) {
  try {
    const [rows] = await salesPool.query<IQuote[]>(
      "SELECT ID, AdjutantID, Quote, Customer, ProjectName, SalesPerson FROM Quotes WHERE ACTIVE = 1 LIMIT 10",
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
