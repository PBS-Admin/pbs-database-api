import Link from "next/link";

interface EndpointCard {
  method: "GET" | "POST";
  path: string;
  description: string;
  href: string;
}

const endpoints: EndpointCard[] = [
  {
    method: "GET",
    path: "/api/employees",
    description: "Returns the first 10 active employees.",
    href: "/employees",
  },
  {
    method: "GET",
    path: "/api/employees/{id}",
    description: "Returns a single employee by ID.",
    href: "/employees",
  },
  {
    method: "GET",
    path: "/api/projectinfo",
    description: "Returns the 10 most recent project info records.",
    href: "/projectinfo",
  },
  {
    method: "POST",
    path: "/api/projectinfo",
    description: "Create or update a project info record.",
    href: "/projectinfo",
  },
];

export default function HomePage() {
  return (
    <div className="container">
      <div className="title-container">
        <div>
          <h1>PBS Database API</h1>
          <p className="subtitle">API Version 1.0 &mdash; Interactive Documentation</p>
        </div>
        <img src="/PBSLogo_Trans.png" alt="PBS Logo" width={300} />
      </div>

      <div className="auth-box">
        <h3>Authentication</h3>
        <p>
          All requests require <code className="inline-code">APIKEY</code> and{" "}
          <code className="inline-code">APIVERSION</code> parameters.
        </p>
        <p style={{ marginTop: ".5rem" }}>
          <strong>GET requests:</strong> Pass as query parameters
          <br />
          <strong>POST requests:</strong> Pass in request body (JSON) along with{" "}
          <code className="inline-code">REQUESTTYPE</code> and{" "}
          <code className="inline-code">DATA1</code>
        </p>
      </div>

      <h2>Available Endpoints</h2>
      <p className="desc" style={{ marginBottom: "1rem" }}>
        Click any endpoint to open its interactive demo page.
      </p>

      {endpoints.map((ep, i) => (
        <Link key={i} href={ep.href} className="card-link">
          <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="card-header">
                <span className={`method-badge method-${ep.method.toLowerCase()}`}>
                  {ep.method}
                </span>
                <span className="path">{ep.path}</span>
              </div>
              <p className="desc">{ep.description}</p>
            </div>
            <span className="card-arrow" style={{ fontSize: "1.25rem" }}>&#8594;</span>
          </div>
        </Link>
      ))}

      <h2>Response Format</h2>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Success</h3>
        <pre>{`{
  "requeststatus": "OK - Records Retrieved",
  "requesttype": "GETPROJECTINFO",
  "data1": [ ...records... ]
}`}</pre>
        <h3 style={{ marginTop: "1rem" }}>Failure</h3>
        <pre>{`{
  "requeststatus": "FAIL - Invalid API Key",
  "internalissues": "The provided API Key is not valid."
}`}</pre>
      </div>

      <div className="footer">PBS Database API v1.0</div>
    </div>
  );
}
