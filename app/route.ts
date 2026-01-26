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
        path: "/api/toolsquotes",
        desc: "get all test quotes (first 10)",
        exampleBody: {},
      },
      {
        type: "POST",
        path: "/api/toolsquotes",
        desc: "update a given test quote",
        exampleBody: {
          ID: 1,
          Customer: "Test Cust",
          ProjectName: "Project 7",
          Quote: 19999,
          SalesPerson: 32,
        },
      },
    ],
  });
}
