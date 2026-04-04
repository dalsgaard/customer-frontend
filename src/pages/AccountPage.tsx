import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '../api/client.js';

export default function AccountPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  const { data: account, isLoading, error } = $api.useQuery('get', '/accounts/{id}', {
    params: { path: { id: id! } },
  });

  const updateMutation = $api.useMutation('patch', '/accounts/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/accounts/{id}', { params: { path: { id } } }] });
      queryClient.invalidateQueries({ queryKey: ['get', '/accounts'] });
      setEditing(false);
    },
  });

  function handleEdit() {
    setName(account!.name);
    setEditing(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate({ params: { path: { id: id! } }, body: { name } });
  }

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

      <div className="flex items-center justify-between mb-4">
        {editing ? (
          <form onSubmit={handleSave} className="flex items-center gap-2 flex-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              required
            />
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {updateMutation.isPending ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h1 className="text-xl font-semibold">{account.name}</h1>
            <button
              onClick={handleEdit}
              className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              Edit
            </button>
          </>
        )}
      </div>

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
