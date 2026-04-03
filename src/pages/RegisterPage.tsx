import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await client.POST('/auth/register', {
      body: { customerId, password },
    });

    setLoading(false);

    if (err) {
      const body = err as { error?: string };
      setError(body.error ?? 'Registration failed');
      return;
    }

    navigate('/login');
  }

  return (
    <div style={{ maxWidth: 360, margin: '4rem auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Register</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input
          placeholder="Customer ID (UUID)"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 8 chars, upper, lower, digit)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
