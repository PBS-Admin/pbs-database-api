"use client";

import { useState } from "react";

interface ApiTesterProps {
  /** Default endpoint path, e.g. "/api/employees" */
  defaultEndpoint: string;
  /** HTTP method */
  method?: "GET" | "POST";
  /** Additional query params beyond APIKEY/APIVERSION */
  extraParams?: { label: string; name: string; placeholder?: string }[];
  /** For POST: fields to include in the request body */
  bodyFields?: {
    label: string;
    name: string;
    type?: "text" | "number" | "datetime-local";
    placeholder?: string;
    required?: boolean;
  }[];
  /** For POST: whether to include REQUESTTYPE selector */
  requestTypes?: string[];
}

export default function ApiTester({
  defaultEndpoint,
  method = "GET",
  extraParams = [],
  bodyFields = [],
  requestTypes = [],
}: ApiTesterProps) {
  const [apiKey, setApiKey] = useState("");
  const [apiVersion, setApiVersion] = useState("1.0");
  const [result, setResult] = useState<{ data: unknown; ok: boolean } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValues, setBodyValues] = useState<Record<string, string>>({});
  const [requestType, setRequestType] = useState(requestTypes[0] ?? "");

  const updateParam = (name: string, value: string) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  };

  const updateBody = (name: string, value: string) => {
    setBodyValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!apiKey.trim()) {
      alert("Please enter your API Key.");
      return;
    }

    setLoading(true);
    try {
      if (method === "GET") {
        const params = new URLSearchParams({
          APIKEY: apiKey.trim(),
          APIVERSION: apiVersion.trim(),
        });
        for (const ep of extraParams) {
          const val = paramValues[ep.name]?.trim();
          if (val) params.set(ep.name, val);
        }

        // Build endpoint, replacing path params like {id}
        let endpoint = defaultEndpoint;
        for (const ep of extraParams) {
          const val = paramValues[ep.name]?.trim();
          if (val && endpoint.includes(`{${ep.name}}`)) {
            endpoint = endpoint.replace(
              `{${ep.name}}`,
              encodeURIComponent(val),
            );
            params.delete(ep.name);
          }
        }

        const res = await fetch(`${endpoint}?${params.toString()}`);
        const data = await res.json();
        setResult({ data, ok: res.ok });
      } else {
        // POST
        const data1: Record<string, unknown> = {};
        for (const field of bodyFields) {
          const val = bodyValues[field.name]?.trim();
          if (!val) continue;
          if (field.type === "number") {
            data1[field.name] = Number(val);
          } else if (field.type === "datetime-local" && val) {
            data1[field.name] = new Date(val).toISOString();
          } else {
            data1[field.name] = val;
          }
        }

        const res = await fetch(defaultEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            APIKEY: apiKey.trim(),
            APIVERSION: apiVersion.trim(),
            REQUESTTYPE: requestType,
            DATA1: data1,
          }),
        });
        const responseData = await res.json();
        setResult({ data: responseData, ok: res.ok });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setResult({ data: { error: message }, ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Try It</h3>
      <div className="input-group">
        <label>
          API Key
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="your-api-key"
            autoComplete="off"
          />
        </label>
        <label>
          API Version
          <input
            type="text"
            value={apiVersion}
            onChange={(e) => setApiVersion(e.target.value)}
          />
        </label>
      </div>

      {extraParams.length > 0 && (
        <div className="input-group">
          {extraParams.map((ep) => (
            <label key={ep.name}>
              {ep.label}
              <input
                type="text"
                value={paramValues[ep.name] ?? ""}
                onChange={(e) => updateParam(ep.name, e.target.value)}
                placeholder={ep.placeholder ?? ""}
              />
            </label>
          ))}
        </div>
      )}

      {requestTypes.length > 0 && (
        <div className="input-group">
          <label>
            Request Type
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              {requestTypes.map((rt) => (
                <option key={rt} value={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {bodyFields.length > 0 && (
        <div className="input-group" style={{ flexWrap: "wrap" }}>
          {bodyFields.map((field) => (
            <label key={field.name} style={{ minWidth: 200 }}>
              <div>
                {field.label}
                {field.required && <span className="required"> *</span>}
              </div>
              <input
                type={
                  field.type === "datetime-local" ? "datetime-local" : "text"
                }
                value={bodyValues[field.name] ?? ""}
                onChange={(e) => updateBody(field.name, e.target.value)}
                placeholder={field.placeholder ?? ""}
              />
            </label>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: ".5rem" }}>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : `Send ${method}`}
        </button>
        {result && (
          <button className="btn-secondary" onClick={() => setResult(null)}>
            Clear
          </button>
        )}
      </div>

      {result && (
        <div className="result-container">
          <div className="status-bar">
            <span
              className={`status-dot ${result.ok ? "status-ok" : "status-fail"}`}
            />
            <span>{result.ok ? "Success" : "Error"}</span>
          </div>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
