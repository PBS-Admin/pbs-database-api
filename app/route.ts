import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Welcome to the PBS database API",
    routes: [
      {
        type: "GET",
        path: "/[slug]",
        desc: "dynamic root route",
        exampleBody: {},
      },
      {
        type: "GET",
        path: "/api/compjobs",
        desc: "get all components jobs (first 10)",
        exampleBody: {},
      },
      {
        type: "GET",
        path: "/api/compjobs/[id]",
        desc: "get components job at given [id]",
        exampleBody: {},
      },
      {
        type: "GET",
        path: "/api/employees",
        desc: "get all employees (first 10)",
        exampleBody: {},
      },
      {
        type: "GET",
        path: "/api/employees/[id]",
        desc: "get employee at give [id]",
        exampleBody: {},
      },
      {
        type: "GET",
        path: "/api/salesquotes",
        desc: "get all buildings quotes (first 10)",
        exampleBody: {},
      },
      {
        type: "GET",
        path: "/api/salesquotes/[id]",
        desc: "get building quote at give [id]",
        exampleBody: {},
      },
      {
        type: "GET",
        path: "/api/projectinfo",
        desc: "get all Sales_Quotes (first 10) with all fields",
        exampleBody: {},
      },
      {
        type: "POST",
        path: "/api/projectinfo",
        desc: "update a Sales_Quotes record by ID with validation",
        exampleBody: {
          ID: 1,
          AdjutantID: 5,
          Quote: 19999,
          Customer: "Test Customer",
          ProjectName: "Project 7",
          SalesPerson: 32,
          ProjectManager: 15,
          Complexity: 3,
          Estimator: 22,
          DateSubmitted: "2026-02-16T10:30:00Z",
          EstDateComp: "2026-03-15T17:00:00Z",
          BidDate: "2026-02-20T14:00:00Z",
        },
      },
    ],
  });
}
