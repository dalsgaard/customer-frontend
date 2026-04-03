import { useNavigate } from 'react-router-dom';
import { $api, clearTokens } from '../api/client.js';

export default function ProfilePage() {
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = $api.useQuery('get', '/profile');

  function handleLogout() {
    clearTokens();
    navigate('/login');
  }

  if (isLoading) return <p className="p-8 text-gray-500">Loading…</p>;
  if (error) return <p className="p-8 text-red-600">Failed to load profile.</p>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer"
          >
            Logout
          </button>
        </div>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-gray-500 font-medium">Name</dt>
            <dd className="text-gray-900">{profile.name}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">Email</dt>
            <dd className="text-gray-900">{profile.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500 font-medium">ID</dt>
            <dd className="text-gray-400 font-mono text-xs">{profile.id}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
