import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Inventory System</h2>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          <span>{user?.name?.[0] || user?.email?.[0] || 'A'}</span>
        </div>
        <div className="user-info">
          <div className="user-name">{user?.name || 'Admin'}</div>
          <div className="user-status">
            <span className="status-dot"></span>
            Online
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <i className="icon">📊</i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/dashboard" className="nav-item">
          <i className="icon">📦</i>
          <span>Product</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
