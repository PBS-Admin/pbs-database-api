import { NextRequest } from "next/server";
import { compPool } from "@/app/db/connection";
import { ICompJob } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  try {
    const [rows] = await compPool.query<ICompJob[]>(
      `SELECT ID, QuoteNumber, QuoteRev, JobNumber, Customer, ProjectName, SalesPerson FROM Jobs WHERE ID = ${id} LIMIT 10`,
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
