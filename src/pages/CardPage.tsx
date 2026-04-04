import { useParams, useNavigate } from 'react-router-dom';
import { $api } from '../api/client.js';

export default function CardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: card, isLoading, error } = $api.useQuery('get', '/cards/{id}', {
    params: { path: { id: id! } },
  });

  if (isLoading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load card.</p>;
  if (!card) return null;

  return (
    <div className="max-w-md">
      <button
        onClick={() => navigate('/cards')}
        className="text-sm text-gray-500 hover:text-gray-800 mb-4 cursor-pointer"
      >
        ← Back to cards
      </button>
      <h1 className="text-xl font-semibold mb-4">{card.cardholderName}</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-gray-500 font-medium">Number</dt>
            <dd className="text-gray-900 font-mono">•••• •••• •••• {card.last4}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">Expires</dt>
            <dd className="text-gray-900">{card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}</dd>
          </div>
          {card.accountName && (
            <div>
              <dt className="text-gray-500 font-medium">Account</dt>
              <dd className="text-gray-900">{card.accountName}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-500 font-medium">Product</dt>
            <dd className="text-gray-900">{card.product.name}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">Network</dt>
            <dd className="text-gray-900">{card.product.network}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">Status</dt>
            <dd className={card.status === 'active' ? 'text-green-600' : 'text-red-600'}>{card.status}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">ID</dt>
            <dd className="text-gray-400 font-mono text-xs">{card.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
