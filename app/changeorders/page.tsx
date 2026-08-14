import Link from "next/link";
import ApiTester from "@/app/components/ApiTester";

export default function ChangeOrdersPage() {
  return (
    <div className="container">
      <Link href="/" className="back-link">
        &#8592; Back to docs
      </Link>

      <h1>Change Orders</h1>
      <p className="subtitle">Query and manage change order records</p>

      {/* GET /api/changeorders */}
      <h2>GET /api/changeorders</h2>
      <div className="card">
        <p className="desc">Returns the 10 most recent change order records.</p>
        <pre>GET /api/changeorders?APIKEY=your-key&amp;APIVERSION=1.0</pre>

        <h3>Response Fields</h3>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code className="inline-code">ID</code></td><td>number</td><td>Record ID</td></tr>
            <tr><td><code className="inline-code">AdjutantID</code></td><td>string</td><td>Unique Project ID</td></tr>
            <tr><td><code className="inline-code">Job</code></td><td>string</td><td>Job Number</td></tr>
            <tr><td><code className="inline-code">CustNo</code></td><td>string</td><td>Customer Number</td></tr>
            <tr><td><code className="inline-code">Customer</code></td><td>string</td><td>Customer Name</td></tr>
            <tr><td><code className="inline-code">ProjectName</code></td><td>string</td><td>Name of the Project</td></tr>
            <tr><td><code className="inline-code">ProjectManager</code></td><td>number</td><td>Employee ID of Project Manager</td></tr>
            <tr><td><code className="inline-code">Complexity</code></td><td>number</td><td>Complexity Rating</td></tr>
            <tr><td><code className="inline-code">COComplexity</code></td><td>number</td><td>Change Order Complexity Rating</td></tr>
            <tr><td><code className="inline-code">Estimator</code></td><td>number</td><td>Employee ID of Estimator</td></tr>
            <tr><td><code className="inline-code">DateSubmitted</code></td><td>datetime</td><td>Submission Date (Started Date)</td></tr>
            <tr><td><code className="inline-code">EstDateComp</code></td><td>datetime</td><td>Estimated Completion Date</td></tr>
            <tr><td><code className="inline-code">ProgressStatus</code></td><td>string</td><td>Text Status</td></tr>
          </tbody>
        </table>
      </div>

      <ApiTester defaultEndpoint="/api/changeorders" />

      {/* POST /api/changeorders */}
      <h2>POST /api/changeorders</h2>
      <div className="card">
        <p className="desc">Create or update a change order record.</p>

        <h3>Request Types</h3>
        <table>
          <thead>
            <tr><th>REQUESTTYPE</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code className="inline-code">NEWCHANGEORDER</code></td>
              <td>Creates a new change order record (inserts if AdjutantID does not exist)</td>
            </tr>
            <tr>
              <td><code className="inline-code">SAVECHANGEORDER</code></td>
              <td>Updates an existing change order record (matched by AdjutantID)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ApiTester
        defaultEndpoint="/api/changeorders"
        method="POST"
        requestTypes={["NEWCHANGEORDER", "SAVECHANGEORDER"]}
        bodyFields={[
          { label: "AdjutantID", name: "AdjutantID", type: "text", placeholder: "e.g. 5", required: true },
          { label: "Job", name: "Job", type: "text", placeholder: "e.g. 19999" },
          { label: "CustNo", name: "CustNo", type: "text", placeholder: "e.g. PBS0001" },
          { label: "Customer", name: "Customer", type: "text", placeholder: "e.g. PBS Test Customer" },
          { label: "ProjectName", name: "ProjectName", type: "text", placeholder: "e.g. Standard Metal Building" },
          { label: "ProjectManager", name: "ProjectManager", type: "number", placeholder: "Employee ID" },
          { label: "Complexity", name: "Complexity", type: "number", placeholder: "e.g. 3" },
          { label: "COComplexity", name: "COComplexity", type: "number", placeholder: "e.g. 3" },
          { label: "Estimator", name: "Estimator", type: "number", placeholder: "Employee ID" },
          { label: "Date Submitted", name: "DateSubmitted", type: "datetime-local" },
          { label: "Est. Completion", name: "EstDateComp", type: "datetime-local" },
          { label: "ProjectStatus", name: "ProjectStatus", type: "text", placeholder: "e.g. In Estimating" },
        ]}
      />

      <div className="footer">PBS Database API v1.0</div>
    </div>
  );
}
