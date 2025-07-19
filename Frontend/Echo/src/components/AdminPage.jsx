import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Camera, Mic, Settings } from 'lucide-react';
import logo from '../img/logo.png'; // same logo as MainApp
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || 'Admin';

  const menuItems = [
    { icon: <User size={20} className="icon"/>, label: 'Registered Users' },
    { icon: <Camera size={20} className="icon"/>, label: 'Face Recognition Logs' },
    { icon: <Mic size={20} className="icon"/>, label: 'Voice Detection Logs' },
    { icon: <Settings size={20} className="icon"/>, label: 'System Settings' },
  ];

  const stats = [
    { icon: '👤', label: 'Total Users: 132' },
    { icon: '📸', label: 'Face Matches Today: 45' },
    { icon: '🎤', label: 'Voice Matches: 28' },
    { icon: '❌', label: 'Unrecognized Attempts: 5' },
  ];

  const logs = [
    { time: '10:05 AM', user: 'John Doe', confidence: '97%', status: 'Matched', color: '#34a853' },
    { time: '10:18 AM', user: 'Unknown', confidence: '52%', status: 'Unmatched', color: '#ea4335' },
  ];

  return (
    <div className="admin-wrapper">
      {/* Header copied from MainApp */}
      <header className="header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img src={logo} alt="EchoFace Logo" className="logo" />
          </Link>
        </div>

        <nav className="nav">
          <ul>
            <li><a href="/#about">About</a></li>
            <li><a href="/#features">Features</a></li>
            <li><a href="/#contact">Contact</a></li>
            {user && <li><Link to="/user">Meeting Room</Link></li>}
          </ul>
        </nav>

        <div className="header-right">
          <button onClick={handleLogout} className="btn outline">Logout</button>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Admin Panel</h2>
          <ul>
            {menuItems.map((item, idx) => (
              <li key={idx}>
                {item.icon} {item.label}
              </li>
            ))}
          </ul>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} className="icon" /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="main">
          <h1>Welcome, {username}</h1>

          <section>
            <h2 className="section-title">System Overview</h2>
            <div className="stats-container">
              {stats.map((card, idx) => (
                <div key={idx} className="stat-card">
                  <span className="stat-icon">{card.icon}</span> {card.label}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-title">Recent Logs</h2>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, idx) => (
                  <tr key={idx}>
                    <td>{log.time}</td>
                    <td>{log.user}</td>
                    <td>{log.confidence}</td>
                    <td style={{ color: log.color, fontWeight: '600' }}>{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
