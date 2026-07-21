import Link from "next/link";
import ApiTester from "@/app/components/ApiTester";

export default function ProjectInfoPage() {
  return (
    <div className="container">
      <Link href="/" className="back-link">
        &#8592; Back to docs
      </Link>

      <h1>Project Info</h1>
      <p className="subtitle">Query and manage project records</p>

      {/* GET /api/projectinfo */}
      <h2>GET /api/projectinfo</h2>
      <div className="card">
        <p className="desc">Returns the 10 most recent project info records.</p>
        <pre>GET /api/projectinfo?APIKEY=your-key&amp;APIVERSION=1.0</pre>

        <h3>Response Fields</h3>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code className="inline-code">ID</code></td><td>number</td><td>Record ID</td></tr>
            <tr><td><code className="inline-code">AdjutantID</code></td><td>number</td><td>Unique project identifier</td></tr>
            <tr><td><code className="inline-code">Quote</code></td><td>number</td><td>Quote number</td></tr>
            <tr><td><code className="inline-code">Customer</code></td><td>string</td><td>Customer name</td></tr>
            <tr><td><code className="inline-code">ProjectName</code></td><td>string</td><td>Name of the project</td></tr>
            <tr><td><code className="inline-code">SalesPerson</code></td><td>number</td><td>Employee ID of salesperson</td></tr>
            <tr><td><code className="inline-code">ProjectManager</code></td><td>number</td><td>Employee ID of project manager</td></tr>
            <tr><td><code className="inline-code">Complexity</code></td><td>number</td><td>Complexity rating</td></tr>
            <tr><td><code className="inline-code">Estimator</code></td><td>number</td><td>Employee ID of estimator</td></tr>
            <tr><td><code className="inline-code">ProjectStreet</code></td><td>string</td><td>Project Street Address</td></tr>
            <tr><td><code className="inline-code">ProjectCity</code></td><td>string</td><td>Project City</td></tr>
            <tr><td><code className="inline-code">ProjectState</code></td><td>string</td><td>Project State</td></tr>
            <tr><td><code className="inline-code">ProjectZip</code></td><td>string</td><td>Project Zip</td></tr>
            <tr><td><code className="inline-code">ProjectCounty</code></td><td>string</td><td>Project County</td></tr>
            <tr><td><code className="inline-code">DateSubmitted</code></td><td>datetime</td><td>Submission date</td></tr>
            <tr><td><code className="inline-code">EstDateComp</code></td><td>datetime</td><td>Estimated completion date</td></tr>
            <tr><td><code className="inline-code">BidDate</code></td><td>datetime</td><td>Bid date</td></tr>
          </tbody>
        </table>
      </div>

      <ApiTester defaultEndpoint="/api/projectinfo" />

      {/* POST /api/projectinfo */}
      <h2>POST /api/projectinfo</h2>
      <div className="card">
        <p className="desc">Create or update a project info record.</p>

        <h3>Request Types</h3>
        <table>
          <thead>
            <tr><th>REQUESTTYPE</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code className="inline-code">NEWPROJECTINFO</code></td>
              <td>Creates a new project record (inserts if AdjutantID does not exist)</td>
            </tr>
            <tr>
              <td><code className="inline-code">SAVEPROJECTINFO</code></td>
              <td>Updates an existing project record (matched by AdjutantID)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ApiTester
        defaultEndpoint="/api/projectinfo"
        method="POST"
        requestTypes={["NEWPROJECTINFO", "SAVEPROJECTINFO"]}
        bodyFields={[
          { label: "AdjutantID", name: "AdjutantID", type: "number", placeholder: "e.g. 5", required: true },
          { label: "Quote", name: "Quote", type: "number", placeholder: "e.g. 19999", required: true },
          { label: "Customer", name: "Customer", type: "text", placeholder: "e.g. PBS Test Customer" },
          { label: "ProjectName", name: "ProjectName", type: "text", placeholder: "e.g. Standard Metal Building" },
          { label: "SalesPerson", name: "SalesPerson", type: "number", placeholder: "Employee ID" },
          { label: "ProjectManager", name: "ProjectManager", type: "number", placeholder: "Employee ID" },
          { label: "Complexity", name: "Complexity", type: "number", placeholder: "e.g. 3" },
          { label: "Estimator", name: "Estimator", type: "number", placeholder: "Employee ID" },
          { label: "ProjectStreet", name: "ProjectStreet", type: "text", placeholder: "e.g. 2100 N Pacific Hwy" },
          { label: "ProjectCity", name: "ProjectCity", type: "text", placeholder: "e.g. Woodburn" },
          { label: "ProjectState", name: "ProjectState", type: "text", placeholder: "e.g. OR" },
          { label: "ProjectZip", name: "ProjectZip", type: "text", placeholder: "e.g. 97071" },
          { label: "ProjectCounty", name: "ProjectCounty", type: "text", placeholder: "e.g. Marion" },
          { label: "Date Submitted", name: "DateSubmitted", type: "datetime-local" },
          { label: "Est. Completion", name: "EstDateComp", type: "datetime-local" },
          { label: "Bid Date", name: "BidDate", type: "datetime-local" },
        ]}
      />

      <div className="footer">PBS Database API v1.0</div>
    </div>
  );
}
