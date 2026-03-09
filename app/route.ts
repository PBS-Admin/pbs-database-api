import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PBS Database API</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a; color: #e2e8f0; line-height: 1.6;
    }
    .container { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }
    .titleContainer {display: flex; justify-content: space-between; align-items: flex-start;}
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: .25rem; color: #f8fafc; }
    .subtitle { color: #94a3b8; margin-bottom: 2rem; }
    h2 { font-size: 1.25rem; font-weight: 600; color: #f8fafc; margin: 2rem 0 1rem; border-bottom: 1px solid #334155; padding-bottom: .5rem; }
    h3 { font-size: 1rem; font-weight: 600; color: #cbd5e1; margin: 1.25rem 0 .5rem; }

    /* Cards */
    .card {
      background: #1e293b; border: 1px solid #334155; border-radius: .5rem;
      padding: 1.25rem; margin-bottom: 1rem;
    }
    .card-header { display: flex; align-items: center; gap: .75rem; margin-bottom: .75rem; }
    .method-badge {
      display: inline-block; padding: .15rem .6rem; border-radius: .25rem;
      font-size: .75rem; font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
    }
    .method-get { background: #065f46; color: #6ee7b7; }
    .method-post { background: #7c2d12; color: #fdba74; }
    .path { font-family: "Cascadia Code", "Fira Code", monospace; font-size: .95rem; color: #f8fafc; }
    .desc { color: #94a3b8; font-size: .875rem; }

    /* Tables */
    table { width: 100%; border-collapse: collapse; margin: .75rem 0; font-size: .875rem; }
    th { text-align: left; padding: .5rem .75rem; background: #0f172a; color: #94a3b8; font-weight: 600; border-bottom: 1px solid #334155; }
    td { padding: .5rem .75rem; border-bottom: 1px solid #1e293b; }
    .required { color: #f87171; font-weight: 600; font-size: .75rem; }
    .optional { color: #94a3b8; font-size: .75rem; }

    /* Code blocks */
    pre {
      background: #0f172a; border: 1px solid #334155; border-radius: .375rem;
      padding: 1rem; overflow-x: auto; font-size: .8rem; line-height: 1.5;
      font-family: "Cascadia Code", "Fira Code", monospace; color: #e2e8f0;
    }
    code { font-family: "Cascadia Code", "Fira Code", monospace; font-size: .85rem; }
    .inline-code { background: #334155; padding: .1rem .4rem; border-radius: .2rem; }

    /* Interactive section */
    .try-section { margin-top: 1rem; }
    .input-group { display: flex; gap: .5rem; margin-bottom: .75rem; flex-wrap: wrap; }
    .input-group label { display: flex; flex-direction: column; gap: .25rem; font-size: .8rem; color: #94a3b8; flex: 1; min-width: 180px; }
    .input-group input, .input-group select {
      background: #0f172a; border: 1px solid #334155; border-radius: .375rem;
      padding: .5rem .75rem; color: #e2e8f0; font-size: .85rem;
      font-family: "Cascadia Code", "Fira Code", monospace;
    }
    .input-group input:focus, .input-group select:focus { outline: none; border-color: #3b82f6; }
    button {
      background: #3b82f6; color: #fff; border: none; border-radius: .375rem;
      padding: .5rem 1.25rem; font-size: .85rem; font-weight: 600; cursor: pointer;
      transition: background .15s;
    }
    button:hover { background: #2563eb; }
    button:disabled { background: #475569; cursor: not-allowed; }
    .btn-secondary { background: #475569; }
    .btn-secondary:hover { background: #64748b; }
    #result {
      margin-top: 1rem; max-height: 400px; overflow-y: auto; display: none;
    }
    #result.visible { display: block; }
    .status-bar { display: flex; align-items: center; gap: .5rem; margin-bottom: .5rem; font-size: .8rem; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-ok { background: #22c55e; }
    .status-fail { background: #ef4444; }

    /* Auth info */
    .auth-box {
      background: #172554; border: 1px solid #1e40af; border-radius: .5rem;
      padding: 1rem 1.25rem; margin-bottom: 1.5rem;
    }
    .auth-box h3 { color: #93c5fd; margin-top: 0; }
    .auth-box p { color: #bfdbfe; font-size: .875rem; }

    /* Tabs */
    .tabs { display: flex; gap: 0; margin-bottom: 0; }
    .tab {
      padding: .5rem 1rem; background: #0f172a; border: 1px solid #334155;
      border-bottom: none; border-radius: .375rem .375rem 0 0;
      color: #94a3b8; font-size: .8rem; font-weight: 600; cursor: pointer;
    }
    .tab.active { background: #1e293b; color: #f8fafc; border-bottom-color: #1e293b; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }

    .footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #334155; color: #64748b; font-size: .8rem; text-align: center; }
  </style>
</head>
<body>

<div class="container">
  <div class="titleContainer"> 
    <div> 
    <h1>PBS Database API</h1>
    <p class="subtitle">API Version 1.0 &mdash; Interactive Documentation</p>
    </div>
    <img src="/PBSLogo_Trans.png" alt="pbs-logo" width="300">
  </div

  <!-- Authentication -->
  <div class="auth-box">
    <h3>Authentication</h3>
    <p>All requests require <code class="inline-code">APIKEY</code> and <code class="inline-code">APIVERSION</code> parameters.</p>
    <p style="margin-top:.5rem;">
      <strong>GET requests:</strong> Pass as query parameters<br/>
      <strong>POST requests:</strong> Pass in request body (form-urlencoded or JSON) along with
      <code class="inline-code">REQUESTTYPE</code> and <code class="inline-code">DATA1</code>
    </p>
  </div>

  <!-- ── ENDPOINTS ─────────────────────────────────────────── -->
  <h2>Available Endpoints</h2>

  <!-- GET /api/employees -->
  <div class="card">
    <div class="card-header">
      <span class="method-badge method-get">GET</span>
      <span class="path">/api/employees</span>
    </div>
    <p class="desc">Returns the first 10 active employees.</p>
    <pre>GET /api/employees?APIKEY=your-key&amp;APIVERSION=1.0</pre>
  </div>

  <!-- GET /api/employees/[id] -->
  <div class="card">
    <div class="card-header">
      <span class="method-badge method-get">GET</span>
      <span class="path">/api/employees/{id}</span>
    </div>
    <p class="desc">Returns a single employee by ID.</p>
    <pre>GET /api/employees/5?APIKEY=your-key&amp;APIVERSION=1.0</pre>
  </div>

  <!-- GET /api/projectinfo -->
  <div class="card">
    <div class="card-header">
      <span class="method-badge method-get">GET</span>
      <span class="path">/api/projectinfo</span>
    </div>
    <p class="desc">Returns the 10 most recent project info records.</p>
    <pre>GET /api/projectinfo?APIKEY=your-key&amp;APIVERSION=1.0</pre>
  </div>

  <!-- POST /api/projectinfo -->
  <div class="card">
    <div class="card-header">
      <span class="method-badge method-post">POST</span>
      <span class="path">/api/projectinfo</span>
    </div>
    <p class="desc">Create or update a project info record.</p>

    <h3>Request Types</h3>
    <table>
      <tr><th>REQUESTTYPE</th><th>Description</th></tr>
      <tr><td><code class="inline-code">NEWPROJECTINFO</code></td><td>Creates a new project record (inserts if AdjutantID does not exist)</td></tr>
      <tr><td><code class="inline-code">SAVEPROJECTINFO</code></td><td>Updates an existing project record (matched by AdjutantID)</td></tr>
    </table>

    <h3>DATA1 Fields</h3>
    <table>
      <thead>
        <tr><th>Field</th><th>Type</th><th>Status</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code class="inline-code">AdjutantID</code></td><td>number</td><td><span class="required">REQUIRED</span></td><td>Unique identifier / lookup key for the project</td></tr>
        <tr><td><code class="inline-code">Quote</code></td><td>number</td><td><span class="optional">optional</span></td><td>Quote number</td></tr>
        <tr><td><code class="inline-code">Customer</code></td><td>string</td><td><span class="optional">optional</span></td><td>Customer name</td></tr>
        <tr><td><code class="inline-code">ProjectName</code></td><td>string</td><td><span class="optional">optional</span></td><td>Name of the project</td></tr>
        <tr><td><code class="inline-code">SalesPerson</code></td><td>number</td><td><span class="optional">optional</span></td><td>Employee ID of the salesperson</td></tr>
        <tr><td><code class="inline-code">ProjectManager</code></td><td>number</td><td><span class="optional">optional</span></td><td>Employee ID of the project manager</td></tr>
        <tr><td><code class="inline-code">Complexity</code></td><td>number</td><td><span class="optional">optional</span></td><td>Complexity rating</td></tr>
        <tr><td><code class="inline-code">Estimator</code></td><td>number</td><td><span class="optional">optional</span></td><td>Employee ID of the estimator</td></tr>
        <tr><td><code class="inline-code">DateSubmitted</code></td><td>datetime</td><td><span class="optional">optional</span></td><td>ISO 8601 date string (e.g. 2026-02-16T10:30:00Z)</td></tr>
        <tr><td><code class="inline-code">EstDateComp</code></td><td>datetime</td><td><span class="optional">optional</span></td><td>Estimated completion date (ISO 8601)</td></tr>
        <tr><td><code class="inline-code">BidDate</code></td><td>datetime</td><td><span class="optional">optional</span></td><td>Bid date (ISO 8601)</td></tr>
      </tbody>
    </table>

    <h3>Example: Create a New Project</h3>
    <div class="tabs">
      <div class="tab active" onclick="switchTab(event, 'tab-form')">Form-Encoded</div>
      <div class="tab" onclick="switchTab(event, 'tab-json')">JSON Body</div>
    </div>
    <div id="tab-form" class="tab-content active">
      <pre>POST /api/projectinfo
Content-Type: application/x-www-form-urlencoded

APIKEY=your-key
&amp;APIVERSION=1.0
&amp;REQUESTTYPE=NEWPROJECTINFO
&amp;DATA1={"AdjutantID":5,"Quote":19999,"Customer":"PBS Test Customer","ProjectName":"Standard Metal Building","SalesPerson":32,"ProjectManager":15,"Complexity":3,"Estimator":22,"DateSubmitted":"2026-02-16T10:30:00Z","EstDateComp":"2026-03-15T17:00:00Z","BidDate":"2026-02-20T14:00:00Z"}</pre>
    </div>
    <div id="tab-json" class="tab-content">
      <pre>{
  "APIKEY": "your-key",
  "APIVERSION": "1.0",
  "REQUESTTYPE": "NEWPROJECTINFO",
  "DATA1": {
    "AdjutantID": 5,
    "Quote": 19999,
    "Customer": "PBS Test Customer",
    "ProjectName": "Standard Metal Building",
    "SalesPerson": 32,
    "ProjectManager": 15,
    "Complexity": 3,
    "Estimator": 22,
    "DateSubmitted": "2026-02-16T10:30:00Z",
    "EstDateComp": "2026-03-15T17:00:00Z",
    "BidDate": "2026-02-20T14:00:00Z"
  }
}</pre>
    </div>
  </div>

  <!-- ── TRY IT ────────────────────────────────────────────── -->
  <h2>Try It &mdash; Fetch Recent Projects</h2>
  <div class="card">
    <p class="desc" style="margin-bottom:1rem;">Enter your API key below to fetch the 10 most recent project info records directly from this page.</p>
    <div class="try-section">
      <div class="input-group">
        <label>
          API Key
          <input type="text" id="apiKeyInput" placeholder="your-api-key" autocomplete="off" />
        </label>
        <label>
          API Version
          <input type="text" id="apiVersionInput" value="1.0" />
        </label>
      </div>
      <div style="display:flex;gap:.5rem;">
        <button onclick="fetchProjects()">Fetch Projects</button>
        <button class="btn-secondary" onclick="fetchEmployees()">Fetch Employees</button>
        <button class="btn-secondary" onclick="clearResult()">Clear</button>
      </div>
      <div id="result">
        <div class="status-bar">
          <span class="status-dot" id="statusDot"></span>
          <span id="statusText"></span>
        </div>
        <pre id="resultBody"></pre>
      </div>
    </div>
  </div>

  <!-- ── RESPONSE FORMAT ───────────────────────────────────── -->
  <h2>Response Format</h2>
  <div class="card">
    <h3>Success</h3>
    <pre>{
  "requeststatus": "OK - Records Retrieved",
  "requesttype": "GETPROJECTINFO",
  "data1": [ ...records... ]
}</pre>
    <h3 style="margin-top:1rem;">Failure</h3>
    <pre>{
  "requeststatus": "FAIL - Invalid API Key",
  "internalissues": "The provided API Key is not valid."
}</pre>
  </div>

  <div class="footer">PBS Database API v1.0</div>
</div>

<script>
function switchTab(e, tabId) {
  const parent = e.target.closest('.card');
  parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  parent.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function showResult(data, ok) {
  const el = document.getElementById('result');
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const body = document.getElementById('resultBody');
  el.classList.add('visible');
  dot.className = 'status-dot ' + (ok ? 'status-ok' : 'status-fail');
  text.textContent = ok ? 'Success' : 'Error';
  body.textContent = JSON.stringify(data, null, 2);
}

function clearResult() {
  document.getElementById('result').classList.remove('visible');
}

async function fetchProjects() {
  const key = document.getElementById('apiKeyInput').value.trim();
  const ver = document.getElementById('apiVersionInput').value.trim();
  if (!key) { alert('Please enter your API Key.'); return; }
  try {
    const res = await fetch('/api/projectinfo?APIKEY=' + encodeURIComponent(key) + '&APIVERSION=' + encodeURIComponent(ver));
    const data = await res.json();
    showResult(data, res.ok);
  } catch (err) {
    showResult({ error: err.message }, false);
  }
}

async function fetchEmployees() {
  const key = document.getElementById('apiKeyInput').value.trim();
  const ver = document.getElementById('apiVersionInput').value.trim();
  if (!key) { alert('Please enter your API Key.'); return; }
  try {
    const res = await fetch('/api/employees?APIKEY=' + encodeURIComponent(key) + '&APIVERSION=' + encodeURIComponent(ver));
    const data = await res.json();
    showResult(data, res.ok);
  } catch (err) {
    showResult({ error: err.message }, false);
  }
}
</script>

</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
