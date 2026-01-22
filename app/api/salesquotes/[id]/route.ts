import { NextRequest } from "next/server";
import { salesPool } from "@/app/db/connection";
import { IQuote } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  try {
    const [rows] = await salesPool.query<IQuote[]>(
      `SELECT ID, AdjutantID, Quote, Customer, ProjectName, SalesPerson FROM Quotes WHERE ID = ${id} LIMIT 10`,
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
