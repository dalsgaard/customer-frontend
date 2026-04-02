import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { $api } from '../api/client.js';

export default function CustomersLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const { data, isLoading, error } = $api.useQuery('get', '/customers');

  const createMutation = $api.useMutation('post', '/customers', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/customers'] });
      setDialogOpen(false);
      setName('');
      setEmail('');
    },
  });

  const deleteMutation = $api.useMutation('delete', '/customers/{id}', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get', '/customers'] });
      navigate('/customers');
    },
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate({ body: { name, email } });
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '1rem',
        alignItems: 'start',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <strong>Customers</strong>
          <button onClick={() => setDialogOpen(true)}>Add</button>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>Failed to load customers.</p>}

        {isLoading ? (
          <p>Loading…</p>
        ) : data?.customers.length === 0 ? (
          <p>No customers yet.</p>
        ) : (
          <ul
            style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            {data?.customers.map((c) => (
              <li
                key={c.id}
                onClick={() => navigate(`/customers/${c.id}`)}
                style={{
                  padding: '0.6rem',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Outlet
        context={{ onDelete: (id: string) => deleteMutation.mutate({ params: { path: { id } } }) }}
      />

      {dialogOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <form
            onSubmit={handleCreate}
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              minWidth: 320,
            }}
          >
            <h2>Add Customer</h2>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setDialogOpen(false)}>
                Cancel
              </button>
              <button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
