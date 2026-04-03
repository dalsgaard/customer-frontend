import { useNavigate } from 'react-router-dom';
import { $api, clearTokens } from '../api/client.js';

export default function ProfilePage() {
  const navigate = useNavigate();

  const { data: profile, isLoading, error } = $api.useQuery('get', '/profile');

  function handleLogout() {
    clearTokens();
    navigate('/login');
  }

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p style={{ color: 'red' }}>Failed to load profile.</p>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: 480, margin: '4rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Profile</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: 8, border: '1px solid #ddd' }}>
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>{profile.id}</p>
      </div>
    </div>
  );
}
