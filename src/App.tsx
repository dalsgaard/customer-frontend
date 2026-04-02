import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import CustomersLayout from './pages/CustomersLayout.js';
import CustomerPage from './pages/CustomerPage.js';
import NotFoundPage from './pages/NotFoundPage.js';

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/">Home</Link>
        <Link to="/customers">Customers</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customers" element={<CustomersLayout />}>
          <Route path=":id" element={<CustomerPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
