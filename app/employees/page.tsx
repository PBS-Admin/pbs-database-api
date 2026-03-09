import Link from "next/link";
import ApiTester from "@/app/components/ApiTester";

export default function EmployeesPage() {
  return (
    <div className="container">
      <Link href="/" className="back-link">
        &#8592; Back to docs
      </Link>

      <h1>Employees</h1>
      <p className="subtitle">Browse and look up employee records</p>

      {/* GET /api/employees */}
      <h2>GET /api/employees</h2>
      <div className="card">
        <p className="desc">Returns the first 10 active employees.</p>
        <pre>GET /api/employees?APIKEY=your-key&amp;APIVERSION=1.0</pre>

        <h3>Response Fields</h3>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code className="inline-code">ID</code></td><td>number</td><td>Employee ID</td></tr>
            <tr><td><code className="inline-code">FullName</code></td><td>string</td><td>Employee full name</td></tr>
            <tr><td><code className="inline-code">Initials</code></td><td>string</td><td>Employee initials</td></tr>
            <tr><td><code className="inline-code">LogInName</code></td><td>string</td><td>Login username</td></tr>
          </tbody>
        </table>
      </div>

      <ApiTester defaultEndpoint="/api/employees" />

      {/* GET /api/employees/[id] */}
      <h2>GET /api/employees/&#123;id&#125;</h2>
      <div className="card">
        <p className="desc">Returns a single employee by ID.</p>
        <pre>GET /api/employees/5?APIKEY=your-key&amp;APIVERSION=1.0</pre>
      </div>

      <ApiTester
        defaultEndpoint="/api/employees/{id}"
        extraParams={[
          { label: "Employee ID", name: "id", placeholder: "e.g. 5" },
        ]}
      />

      <div className="footer">PBS Database API v1.0</div>
    </div>
  );
}
