import { Link } from 'react-router-dom';
import { $api } from '../api/client.js';

export default function CardsPage() {
  const { data: cards, isLoading, error } = $api.useQuery('get', '/cards');

  if (isLoading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load cards.</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">Cards</h1>
      {cards?.length === 0 ? (
        <p className="text-gray-500">No cards found.</p>
      ) : (
        <ul className="space-y-2">
          {cards?.map((card) => (
            <li key={card.id}>
              <Link
                to={`/cards/${card.id}`}
                className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{card.cardholderName}</span>
                  <span className="text-sm text-gray-500">{card.product.network} {card.product.type}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">•••• {card.last4}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
