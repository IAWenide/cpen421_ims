import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { inventoryAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import InventoryList from '../components/InventoryList';
import './Dashboard.css';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await inventoryAPI.getAllItems();
      setItems(data);
      setError('');
    } catch (err) {
      setError('Failed to load inventory items');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddNew = () => {
    navigate('/add-item');
  };

  const handleEdit = (id) => {
    navigate(`/edit-item/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.deleteItem(id);
        setItems(items.filter((item) => item._id !== id));
      } catch (err) {
        setError('Failed to delete item');
        console.error('Error deleting item:', err);
      }
    }
  };

  // Calculate statistics
  const totalProducts = items.length;
  const totalCategories = [...new Set(items.map(item => item.category))].length;
  const lowStockItems = items.filter(item => item.quantity < 10).length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      <Sidebar user={user} />

      <div className="dashboard-content">
        <header className="top-header">
          <h1>Dashboard</h1>
          <div className="header-right">
            <span className="user-name">👤 {user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="btn-logout-small">
              Logout
            </button>
          </div>
        </header>

        <main className="main-content">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <StatsCard
              title="Total Products"
              value={totalProducts}
              icon="📦"
              color="orange"
            />
            <StatsCard
              title="Categories"
              value={totalCategories}
              icon="📑"
              color="green"
            />
            <StatsCard
              title="Low Stock"
              value={lowStockItems}
              icon="⚠️"
              color="red"
            />
            <StatsCard
              title="Total Value"
              value={`$${totalValue.toFixed(2)}`}
              icon="💰"
              color="blue"
            />
          </div>

          {/* Products Section */}
          <div className="products-section">
            <div className="section-header">
              <h2>List of Products</h2>
              <button onClick={handleAddNew} className="btn-add">
                + Add Products
              </button>
            </div>

            <div className="table-controls">
              <div className="show-entries">
                <label>
                  Show{' '}
                  <select>
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                  {' '}entries
                </label>
              </div>
              <div className="search-box">
                <label>
                  Search:{' '}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                  />
                </label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Loading inventory...</div>
            ) : (
              <InventoryList
                items={filteredItems}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
