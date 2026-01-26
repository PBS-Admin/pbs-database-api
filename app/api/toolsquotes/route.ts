import { NextRequest } from "next/server";
import { toolsPool } from "@/app/db/connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface IToolQuote extends RowDataPacket {
  ID: number;
  Quote: number;
  Customer: string;
  ProjectName: string;
  SalesPerson: number;
}

export async function GET(request: NextRequest) {
  try {
    const [rows] = await toolsPool.query<IToolQuote[]>(
      "SELECT ID, Quote, Customer, ProjectName, SalesPerson FROM Dealer_Quotes LIMIT 10",
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ID, Quote, Customer, ProjectName, SalesPerson } = body ?? {};

    if (typeof ID !== "number" || Number.isNaN(ID)) {
      return new Response(
        JSON.stringify({ error: "Field 'ID' (number) is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const fields: string[] = [];
    const values: any[] = [];

    if (typeof Quote === "number") {
      fields.push("Quote = ?");
      values.push(Quote);
    }
    if (typeof Customer === "string") {
      fields.push("Customer = ?");
      values.push(Customer);
    }
    if (typeof ProjectName === "string") {
      fields.push("ProjectName = ?");
      values.push(ProjectName);
    }
    if (typeof SalesPerson === "number") {
      fields.push("SalesPerson = ?");
      values.push(SalesPerson);
    }

    if (fields.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Provide at least one updatable field: Quote (number), Customer (string), ProjectName (string), SalesPerson (number).",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const sql = `
      UPDATE Sales_Quotes
      SET ${fields.join(", ")}
      WHERE ID = ?
      LIMIT 1
    `;
    values.push(ID);

    const [result] = await toolsPool.execute<ResultSetHeader>(sql, values);

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: `Quote with ID ${ID} not found.` }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const [rows] = await toolsPool.query<IToolQuote[]>(
      "SELECT ID AS id, Quote, Customer, ProjectName, SalesPerson FROM Sales_Quotes WHERE ID = ? LIMIT 1",
      [ID],
    );

    return new Response(JSON.stringify({ message: "Updated", data: rows[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("POST /Dealer_Quotes update error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
