import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import type { components } from "../../openapi/types.js";

type Customer = components["schemas"]["Customer"];

export default function CustomersLayout() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setError(null);
    const { data, error: err } = await api.GET("/customers");
    if (err) {
      setError("Failed to load customers.");
    } else {
      setCustomers(data.customers);
    }
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data, error: err } = await api.POST("/customers", {
      body: { name, email },
    });
    if (err) {
      setError("Failed to create customer.");
    } else {
      setCustomers((prev) => [...prev, data]);
      setDialogOpen(false);
      setName("");
      setEmail("");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const { error: err } = await api.DELETE("/customers/{id}", {
      params: { path: { id } },
    });
    if (err) {
      setError("Failed to delete customer.");
    } else {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      navigate("/customers");
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1rem", alignItems: "start" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <strong>Customers</strong>
          <button onClick={() => setDialogOpen(true)}>Add</button>
        </div>

        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

        {loading ? (
          <p>Loading…</p>
        ) : customers.length === 0 ? (
          <p>No customers yet.</p>
        ) : (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {customers.map((c) => (
              <li
                key={c.id}
                onClick={() => navigate(`/customers/${c.id}`)}
                style={{ padding: "0.6rem", border: "1px solid #ddd", borderRadius: 4, cursor: "pointer" }}
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Outlet context={{ onDelete: handleDelete }} />

      {dialogOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <form
            onSubmit={handleCreate}
            style={{ background: "white", padding: "2rem", borderRadius: 8, display: "flex", flexDirection: "column", gap: "1rem", minWidth: 320 }}
          >
            <h2>Add Customer</h2>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setDialogOpen(false)}>Cancel</button>
              <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
