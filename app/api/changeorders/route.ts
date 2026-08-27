import { NextRequest } from "next/server";
import { toolsPool } from "@/app/db/connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { validateRequest, okResponse, failResponse } from "@/app/lib/apiAuth";

export interface IToolQuote extends RowDataPacket {
  ID: number;
  AdjutantID: string | null;
  Job: string | null;
  CustNo: string | null;
  Customer: string | null;
  ProjectName: string | null;
  ProjectManager: number | null;
  JobComplex: number | null;
  COComplex: number | null;
  Estimator: number | null;
  Progress: number | null;
  OnHold: number | null;
  DateStarted: Date | null;
  DateSubmitted: Date | null;
  EstDateComp: Date | null;
}

const SELECT_FIELDS = `ID, AdjutantID, Job, CustNo, Customer, ProjectName, ProjectManager,
  JobComplex, COComplex, Estimator, Progress, OnHold, DateStarted, DateSubmitted, EstDateComp`;

export async function GET(request: NextRequest) {
  const auth = await validateRequest(request);
  if (!auth.valid) return auth.response;

  try {
    const [rows] = await toolsPool.query<IToolQuote[]>(
      `SELECT ${SELECT_FIELDS} FROM COs LIMIT 10`,
    );

    return okResponse("GETCHANGEORDER", rows, "Records Retrieved");
  } catch (err) {
    console.error("GET /api/changeorders error:", err);
    return failResponse(
      "Internal Server Error",
      "An unexpected error occurred.",
      500,
    );
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

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export async function POST(request: NextRequest) {
  const auth = await validateRequest(request);
  if (!auth.valid) return auth.response;

  // Validate REQUESTTYPE
  const requestType = auth.requestType;
  if (!requestType) {
    return failResponse(
      "Missing REQUESTTYPE",
      "REQUESTTYPE is required for POST requests.",
    );
  }

  const validTypes = ["SAVECHANGEORDER", "NEWCHANGEORDER"];
  if (!validTypes.includes(requestType)) {
    return failResponse(
      "Invalid REQUESTTYPE",
      `REQUESTTYPE '${requestType}' is not valid. Valid types: ${validTypes.join(", ")}`,
    );
  }

  // Extract data from DATA1
  const data1 = auth.data1;
  if (!data1 || typeof data1 !== "object") {
    return failResponse(
      "Missing DATA1",
      "DATA1 is required and must be a JSON object.",
    );
  }

  const {
    AdjutantID,
    Job,
    CustNo,
    Customer,
    ProjectName,
    SalesPerson,
    ProjectManager,
    Complexity,
    COComplexity,
    Estimator,
    Status,
    DateSubmitted,
    EstDateComp,
  } = data1;

  try {
    // AdjutantID is required as the lookup key
    const parsedAdjutantID = AdjutantID;
    if (
      AdjutantID === null ||
      AdjutantID === undefined
    ) {
      return failResponse(
        "Invalid DATA1",
        "Field 'AdjutantID' (string) is required in DATA1.",
      );
    }

    // Collect optional fields
    const columns: { name: string; value: any }[] = [];

    if (typeof Job === "string")
      columns.push({ name: "Job", value: Job });
//    if (typeof SalesPerson === "number") {
//      columns.push({ name: "SalesPerson", value: SalesPerson });
//    } else if (typeof SalesPerson === "string") {
//      columns.push({ name: "SalesPerson", value: +SalesPerson });
//    }
    if (typeof ProjectManager === "number") {
      columns.push({ name: "ProjectManager", value: ProjectManager });
    } else if (typeof ProjectManager === "string") {
      columns.push({ name: "ProjectManager", value: +ProjectManager });
    }
    if (typeof Complexity === "number") {
      columns.push({ name: "JobComplex", value: Complexity });
    } else if (typeof Complexity === "string") {
      columns.push({ name: "JobComplex", value: +Complexity });
    }
    if (typeof COComplexity === "number") {
      columns.push({ name: "COComplex", value: COComplexity });
    } else if (typeof Complexity === "string") {
      columns.push({ name: "COComplex", value: +COComplexity });
    }
    if (typeof Estimator === "number") {
      columns.push({ name: "Estimator", value: Estimator });
    } else if (typeof Estimator === "string") {
      columns.push({ name: "Estimator", value: +Estimator });
    }
    if (typeof CustNo === "string")
      columns.push({ name: "CustNo", value: CustNo });
    if (typeof Customer === "string")
      columns.push({ name: "Customer", value: Customer });
    if (typeof ProjectName === "string")
      columns.push({ name: "ProjectName", value: ProjectName });
    if (typeof Status === "string") {
      if (Status == "Quote Started") {
        columns.push({ name: "Progress", value: 1 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (Status == "Est Review") {
        columns.push({ name: "Progress", value: 10001 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (Status == "In Estimating") {
        columns.push({ name: "Progress", value: 10001 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (Status == "Est Checking") {
        columns.push({ name: "Progress", value: 110001 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (Status == "Check Review") {
        columns.push({ name: "Progress", value: 110001 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (Status == "Quote Finished") {
        columns.push({ name: "Progress", value: 1010101 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (Status == "On Hold") {
        columns.push({ name: "OnHold", value: 1 });
      }
    }

//    try {
      const formattedDateSubmitted = validateAndFormatDatetime(
        DateSubmitted,
        "DateSubmitted",
      );
      if (formattedDateSubmitted !== null) {
//        columns.push({ name: "DateSubmitted", value: formattedDateSubmitted });
        columns.push({ name: "DateStarted", value: formattedDateSubmitted });
      } else {
//        columns.push({ name: "DateSubmitted", value: null });
        columns.push({ name: "DateStarted", value: null });
      }

      const formattedEstDateComp = validateAndFormatDatetime(
        EstDateComp,
        "EstDateComp",
      );
      if (formattedEstDateComp !== null) {
        columns.push({ name: "EstDateComp", value: formattedEstDateComp });
      } else {
        columns.push({ name: "EstDateComp", value: null });
      }

//    } catch (err: any) {
//      return failResponse("Invalid DATA1", err.message);
//      return failResponse("Date Format: " + EstDateComp, EstDateComp);
//    }

    // Check if AdjutantID already exists
    const [existing] = await toolsPool.query<IToolQuote[]>(
      "SELECT ID FROM COs WHERE AdjutantID = ? LIMIT 1",
      [parsedAdjutantID],
    );

    if (existing.length > 0) {
      // UPDATE existing record
      if (columns.length === 0) {
        return failResponse(
          "Invalid DATA1",
          "Provide at least one field to update in DATA1. Valid fields: Job (numstringber), CustNo (string), Customer (string), ProjectName (string), ProjectManager (number), Complexity (number), COComplexity (number), Estimator (number), Status (string), DateSubmitted (datetime), EstDateComp (datetime).",
        );
      }

      const setClause = columns.map((c) => `${c.name} = ?`).join(", ");
      const updateValues = [...columns.map((c) => c.value), parsedAdjutantID];

      await toolsPool.execute<ResultSetHeader>(
        `UPDATE COs SET ${setClause} WHERE AdjutantID = ? LIMIT 1`,
        updateValues,
      );

      const [rows] = await toolsPool.query<IToolQuote[]>(
        `SELECT ${SELECT_FIELDS} FROM COs WHERE AdjutantID = ? LIMIT 1`,
        [parsedAdjutantID],
      );

      return okResponse("SAVECHANGEORDER", rows[0], "Record Updated");
    } else {
      // INSERT new record
      const insertColumns = ["AdjutantID", ...columns.map((c) => c.name)];
      const insertValues = [parsedAdjutantID, ...columns.map((c) => c.value)];
      const placeholders = insertColumns.map(() => "?").join(", ");

      const [result] = await toolsPool.execute<ResultSetHeader>(
        `INSERT INTO COs (${insertColumns.join(", ")}) VALUES (${placeholders})`,
        insertValues,
      );

      const [rows] = await toolsPool.query<IToolQuote[]>(
        `SELECT ${SELECT_FIELDS} FROM COs WHERE ID = ? LIMIT 1`,
        [result.insertId],
      );

      return okResponse("NEWCHANGEORDER", rows[0], "Record Created", 201);
    }
  } catch (err) {
    console.error("POST /api/changeorders error:", err);
    return failResponse(
      "Internal Server Error",
      "An unexpected error occurred.",
      500,
    );
  }
}
