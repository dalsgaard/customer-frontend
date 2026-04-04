import { $api } from '../api/client.js';

export default function ProfilePage() {
  const { data: profile, isLoading, error } = $api.useQuery('get', '/profile');

  if (isLoading) return <p className="text-gray-500">Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load profile.</p>;
  if (!profile) return null;

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold mb-4">Profile</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
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
