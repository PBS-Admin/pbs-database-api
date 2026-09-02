import { NextRequest } from "next/server";
import { toolsPool } from "@/app/db/connection";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { validateRequest, okResponse, failResponse } from "@/app/lib/apiAuth";

export interface IToolQuote extends RowDataPacket {
  ID: number;
  AdjutantID: number | null;
  Quote: number | null;
  CustNo: string | null;
  Customer: string | null;
  ProjectName: string | null;
  SalesPerson: number | null;
  ProjectManager: number | null;
  Complexity: number | null;
  Estimator: number | null;
  ProjectStreet: string | null;
  ProjectCity: string | null;
  ProjectState: string | null;
  ProjectZip: string | null;
  ProjectCounty: string | null;
  Progress: number | null;
  OnHold: number | null;
  DateStarted: Date | null;
  DateSubmitted: Date | null;
  EstDateComp: Date | null;
  BidDate: Date | null;
}

const SELECT_FIELDS = `ID, AdjutantID, Quote, CustNo, Customer, ProjectName, SalesPerson,
  ProjectManager, Complexity, Estimator, ProjectStreet, ProjectCity, ProjectState, ProjectZip,
  ProjectCounty, Progress, OnHold, DateStarted, DateSubmitted, EstDateComp, BidDate`;

export async function GET(request: NextRequest) {
  const auth = await validateRequest(request);
  if (!auth.valid) return auth.response;

  try {
    const [rows] = await toolsPool.query<IToolQuote[]>(
      `SELECT ${SELECT_FIELDS} FROM Quotes LIMIT 10`,
    );

    return okResponse("GETPROJECTINFO", rows, "Records Retrieved");
  } catch (err) {
    console.error("GET /api/projectinfo error:", err);
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

  const validTypes = ["SAVEPROJECTINFO", "NEWPROJECTINFO"];
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
    Quote,
    CustNo,
    Customer,
    ProjectName,
    SalesPerson,
    ProjectManager,
    Complexity,
    Estimator,
    ProjectStreet,
    ProjectCity,
    ProjectState,
    ProjectZip,
    ProjectCounty,
    ProjectStatus,
    DateSubmitted,
    EstDateComp,
    BidDate,
  } = data1;

  try {
    // AdjutantID is required as the lookup key
    const parsedAdjutantID = Number(AdjutantID);
    if (
      AdjutantID === null ||
      AdjutantID === undefined ||
      Number.isNaN(parsedAdjutantID)
    ) {
      return failResponse(
        "Invalid DATA1",
        "Field 'AdjutantID' (number) is required in DATA1.",
      );
    }

    // Collect optional fields
    const columns: { name: string; value: any }[] = [];

    if (typeof Quote === "number") {
      columns.push({ name: "Quote", value: Quote });
    } else if (typeof Quote === "string") {
      columns.push({ name: "Quote", value: +Quote });
    }
    if (typeof SalesPerson === "number") {
      columns.push({ name: "SalesPerson", value: SalesPerson });
    } else if (typeof SalesPerson === "string") {
//      columns.push({ name: "SalesPerson", value: +SalesPerson });
      columns.push({ name: "SalesPerson", value: 0 });
    }
    if (typeof ProjectManager === "number") {
      columns.push({ name: "ProjectManager", value: ProjectManager });
    } else if (typeof ProjectManager === "string") {
//      columns.push({ name: "ProjectManager", value: +ProjectManager });
      columns.push({ name: "ProjectManager", value: 0 });
    }
    if (typeof Complexity === "number") {
      columns.push({ name: "Complexity", value: Complexity });
    } else if (typeof Complexity === "string") {
      columns.push({ name: "Complexity", value: +Complexity });
    }
    if (typeof Estimator === "number") {
      columns.push({ name: "Estimator", value: Estimator });
    } else if (typeof Estimator === "string") {
//      columns.push({ name: "Estimator", value: +Estimator });
      columns.push({ name: "Estimator", value:0 });
    }
    if (typeof CustNo === "string")
      columns.push({ name: "CustNo", value: CustNo });
    if (typeof Customer === "string")
      columns.push({ name: "Customer", value: Customer });
    if (typeof ProjectName === "string")
      columns.push({ name: "ProjectName", value: ProjectName });
    if (typeof ProjectStreet === "string")
      columns.push({ name: "ProjectStreet", value: ProjectStreet });
    if (typeof ProjectCity === "string")
      columns.push({ name: "ProjectCity", value: ProjectCity });
    if (typeof ProjectState === "string")
      columns.push({ name: "ProjectState", value: ProjectState });
    if (typeof ProjectZip === "string")
      columns.push({ name: "ProjectZip", value: ProjectZip });
    if (typeof ProjectCounty === "string")
      columns.push({ name: "ProjectCounty", value: ProjectCounty });
    if (typeof ProjectStatus === "string") {
      if (ProjectStatus == "Quote Started") {
        columns.push({ name: "Progress", value: 1 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (ProjectStatus == "Est Review") {
        columns.push({ name: "Progress", value: 101 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (ProjectStatus == "In Estimating") {
        columns.push({ name: "Progress", value: 1101 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (ProjectStatus == "Est Checking") {
        columns.push({ name: "Progress", value: 11101 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (ProjectStatus == "Check Review") {
        columns.push({ name: "Progress", value: 111101 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (ProjectStatus == "Quote Finished") {
        columns.push({ name: "Progress", value: 1111101 });
        columns.push({ name: "OnHold", value: 0 });
      }
      if (ProjectStatus == "On Hold") {
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
        columns.push({ name: "DateStarted", value: "null" });
      }

      const formattedEstDateComp = validateAndFormatDatetime(
        EstDateComp,
        "EstDateComp",
      );
      if (formattedEstDateComp !== null) {
        columns.push({ name: "EstDateComp", value: formattedEstDateComp });
      } else {
        columns.push({ name: "EstDateComp", value: "null" });
      }

      const formattedBidDate = validateAndFormatDatetime(BidDate, "BidDate");
      if (formattedBidDate !== null) {
        columns.push({ name: "BidDate", value: formattedBidDate });
      } else {
        columns.push({ name: "BidDate", value: "null" });
      }

//    } catch (err: any) {
//      return failResponse("Invalid DATA1", err.message);
//      return failResponse("Date Format: " + EstDateComp, EstDateComp);
//    }

    // Check if AdjutantID already exists
    const [existing] = await toolsPool.query<IToolQuote[]>(
      "SELECT ID FROM Quotes WHERE AdjutantID = ? LIMIT 1",
      [parsedAdjutantID],
    );

    if (existing.length > 0) {
      // UPDATE existing record
      if (columns.length === 0) {
        return failResponse(
          "Invalid DATA1",
          "Provide at least one field to update in DATA1. Valid fields: Quote (number), CustNo (string), Customer (string), ProjectName (string), SalesPerson (number), ProjectManager (number), Complexity (number), Estimator (number), ProjectStreet (string), ProjectCity (string), ProjectState (string), ProjectZip (string), ProjectCounty (string), ProjectStatus (string), DateSubmitted (datetime), EstDateComp (datetime), BidDate (datetime).",
        );
      }

      const setClause = columns.map((c) => `${c.name} = ?`).join(", ");
      const updateValues = [...columns.map((c) => c.value), parsedAdjutantID];

      await toolsPool.execute<ResultSetHeader>(
        `UPDATE Quotes SET ${setClause} WHERE AdjutantID = ? LIMIT 1`,
        updateValues,
      );

      const [rows] = await toolsPool.query<IToolQuote[]>(
        `SELECT ${SELECT_FIELDS} FROM Quotes WHERE AdjutantID = ? LIMIT 1`,
        [parsedAdjutantID],
      );

      return okResponse("SAVEPROJECTINFO", rows[0], "Record Updated");
    } else {
      // INSERT new record
      const insertColumns = ["AdjutantID", ...columns.map((c) => c.name)];
      const insertValues = [parsedAdjutantID, ...columns.map((c) => c.value)];
      const placeholders = insertColumns.map(() => "?").join(", ");

      const [result] = await toolsPool.execute<ResultSetHeader>(
        `INSERT INTO Quotes (${insertColumns.join(", ")}) VALUES (${placeholders})`,
        insertValues,
      );

      const [rows] = await toolsPool.query<IToolQuote[]>(
        `SELECT ${SELECT_FIELDS} FROM Quotes WHERE ID = ? LIMIT 1`,
        [result.insertId],
      );

      return okResponse("NEWPROJECTINFO", rows[0], "Record Created", 201);
    }
  } catch (err) {
    console.error("POST /api/projectinfo error:", err);
    return failResponse(
      "Internal Server Error",
      "An unexpected error occurred.",
      500,
    );
  }
}
