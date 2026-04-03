import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client, { setTokens } from '../api/client.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: err } = await client.POST('/auth/login', {
      body: { email, password },
    });

    setLoading(false);

    if (err || !data) {
      setError('Invalid email or password');
      return;
    }

    setTokens(data.accessToken, data.idToken, data.refreshToken);
    navigate('/profile');
  }

  return (
    <div style={{ maxWidth: 360, margin: '4rem auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Login</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
