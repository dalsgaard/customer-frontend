import { useParams, useNavigate } from 'react-router-dom';
import { $api } from '../api/client.js';

export default function AccountPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: account, isLoading, error } = $api.useQuery('get', '/accounts/{id}', {
    params: { path: { id: id! } },
  });

  if (isLoading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load account.</p>;
  if (!account) return null;

  return (
    <div className="max-w-md">
      <button
        onClick={() => navigate('/accounts')}
        className="text-sm text-gray-500 hover:text-gray-800 mb-4 cursor-pointer"
      >
        ← Back to accounts
      </button>
      <h1 className="text-xl font-semibold mb-4">{account.name}</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-gray-500 font-medium">IBAN</dt>
            <dd className="text-gray-900 font-mono">{account.iban}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">Currency</dt>
            <dd className="text-gray-900">{account.currency}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">ID</dt>
            <dd className="text-gray-400 font-mono text-xs">{account.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
