import { $api } from '../api/client.js';

export default function AccountsPage() {
  const { data: accounts, isLoading, error } = $api.useQuery('get', '/accounts');

  if (isLoading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load accounts.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Accounts</h1>
      {accounts?.length === 0 ? (
        <p className="text-gray-500">No accounts found.</p>
      ) : (
        <ul className="space-y-2">
          {accounts?.map((account) => (
            <li
              key={account.id}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{account.name}</span>
                <span className="text-sm text-gray-500">{account.currency}</span>
              </div>
              <p className="text-sm text-gray-400 font-mono mt-1">{account.iban}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
