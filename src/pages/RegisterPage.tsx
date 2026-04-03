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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            placeholder="Customer ID (UUID)"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password (min 8 chars, upper, lower, digit)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Registering…' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
