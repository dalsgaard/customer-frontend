import { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import type { components } from "../../openapi/types.js";

type Customer = components["schemas"]["Customer"];
type OutletContext = { onDelete: (id: string) => void };

export default function CustomerPage() {
  const { id } = useParams<{ id: string }>();
  const { onDelete } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCustomer(null);
    api.GET("/customers/{id}", { params: { path: { id } } }).then(({ data, error: err }) => {
      if (err) {
        setError("Failed to load customer.");
      } else {
        setCustomer(data);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!customer) return null;

  return (
    <div style={{ background: "white", padding: "1.5rem", borderRadius: 8, border: "1px solid #ddd" }}>
      <h2 style={{ marginBottom: "1rem" }}>{customer.name}</h2>
      <p><strong>Name:</strong> {customer.name}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.5rem" }}>{customer.id}</p>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
        <button onClick={() => onDelete(customer.id)}>Delete</button>
        <button onClick={() => navigate("/customers")}>Close</button>
      </div>
    </div>
  );
}
