import { NextRequest } from "next/server";
import { toolsPool } from "@/app/db/connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface IToolQuote extends RowDataPacket {
  ID: number;
  AdjutantID: number | null;
  Quote: number | null;
  Customer: string | null;
  ProjectName: string | null;
  SalesPerson: number | null;
  ProjectManager: number | null;
  Complexity: number | null;
  Estimator: number | null;
  DateSubmitted: Date | null;
  EstDateComp: Date | null;
  BidDate: Date | null;
}

export async function GET(request: NextRequest) {
  try {
    const [rows] = await toolsPool.query<IToolQuote[]>(
      `SELECT ID, AdjutantID, Quote, Customer, ProjectName, SalesPerson,
              ProjectManager, Complexity, Estimator, DateSubmitted,
              EstDateComp, BidDate
       FROM Quotes
       LIMIT 10`,
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

// Helper function to validate and format datetime for MySQL
function validateAndFormatDatetime(
  value: any,
  fieldName: string,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(
      `Field '${fieldName}' must be a valid ISO 8601 datetime string or Date object.`,
    );
  }

  // Format as MySQL datetime: YYYY-MM-DD HH:MM:SS
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      AdjutantID,
      Quote,
      Customer,
      ProjectName,
      SalesPerson,
      ProjectManager,
      Complexity,
      Estimator,
      DateSubmitted,
      EstDateComp,
      BidDate,
    } = body ?? {};

    // AdjutantID is required as the lookup key
    if (typeof AdjutantID !== "number" || Number.isNaN(AdjutantID)) {
      return new Response(
        JSON.stringify({ error: "Field 'AdjutantID' (number) is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Collect optional fields into a unified structure for reuse in UPDATE/INSERT
    const columns: { name: string; value: any }[] = [];

    if (typeof Quote === "number") columns.push({ name: "Quote", value: Quote });
    if (typeof SalesPerson === "number") columns.push({ name: "SalesPerson", value: SalesPerson });
    if (typeof ProjectManager === "number") columns.push({ name: "ProjectManager", value: ProjectManager });
    if (typeof Complexity === "number") columns.push({ name: "Complexity", value: Complexity });
    if (typeof Estimator === "number") columns.push({ name: "Estimator", value: Estimator });
    if (typeof Customer === "string") columns.push({ name: "Customer", value: Customer });
    if (typeof ProjectName === "string") columns.push({ name: "ProjectName", value: ProjectName });

    try {
      const formattedDateSubmitted = validateAndFormatDatetime(DateSubmitted, "DateSubmitted");
      if (formattedDateSubmitted !== null) columns.push({ name: "DateSubmitted", value: formattedDateSubmitted });

      const formattedEstDateComp = validateAndFormatDatetime(EstDateComp, "EstDateComp");
      if (formattedEstDateComp !== null) columns.push({ name: "EstDateComp", value: formattedEstDateComp });

      const formattedBidDate = validateAndFormatDatetime(BidDate, "BidDate");
      if (formattedBidDate !== null) columns.push({ name: "BidDate", value: formattedBidDate });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const selectSql = `
      SELECT ID, AdjutantID, Quote, Customer, ProjectName, SalesPerson,
             ProjectManager, Complexity, Estimator, DateSubmitted,
             EstDateComp, BidDate
      FROM Quotes
      WHERE AdjutantID = ?
      LIMIT 1
    `;

    // Check if AdjutantID already exists
    const [existing] = await toolsPool.query<IToolQuote[]>(
      `SELECT ID FROM Quotes WHERE AdjutantID = ? LIMIT 1`,
      [AdjutantID],
    );

    if (existing.length > 0) {
      // UPDATE: at least one field is required
      if (columns.length === 0) {
        return new Response(
          JSON.stringify({
            error:
              "Provide at least one field to update. Valid fields: Quote (number), Customer (string), ProjectName (string), SalesPerson (number), ProjectManager (number), Complexity (number), Estimator (number), DateSubmitted (datetime), EstDateComp (datetime), BidDate (datetime).",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const setClause = columns.map((c) => `${c.name} = ?`).join(", ");
      const updateValues = [...columns.map((c) => c.value), AdjutantID];

      await toolsPool.execute<ResultSetHeader>(
        `UPDATE Sales_Quotes SET ${setClause} WHERE AdjutantID = ? LIMIT 1`,
        updateValues,
      );

      const [rows] = await toolsPool.query<IToolQuote[]>(selectSql, [AdjutantID]);

      return new Response(
        JSON.stringify({ message: "Updated", data: rows[0] }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } else {
      // INSERT: AdjutantID is always included; other fields are optional
      const insertColumns = ["AdjutantID", ...columns.map((c) => c.name)];
      const insertValues = [AdjutantID, ...columns.map((c) => c.value)];
      const placeholders = insertColumns.map(() => "?").join(", ");

      const [result] = await toolsPool.execute<ResultSetHeader>(
        `INSERT INTO Sales_Quotes (${insertColumns.join(", ")}) VALUES (${placeholders})`,
        insertValues,
      );

      const [rows] = await toolsPool.query<IToolQuote[]>(
        `SELECT ID, AdjutantID, Quote, Customer, ProjectName, SalesPerson,
                ProjectManager, Complexity, Estimator, DateSubmitted,
                EstDateComp, BidDate
         FROM Quotes WHERE ID = ? LIMIT 1`,
        [result.insertId],
      );

      return new Response(
        JSON.stringify({ message: "Created", data: rows[0] }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (err) {
    console.error("POST /api/projectinfo upsert error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
