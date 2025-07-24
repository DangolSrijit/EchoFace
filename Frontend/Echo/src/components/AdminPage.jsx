import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, ListChecks, DoorOpen, Settings } from 'lucide-react';
import axios from 'axios';
import logo from '../img/logo.png';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [recognizedTotal, setRecognizedTotal] = useState(0);
  const [roomCount, setRoomCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || 'Admin';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const accessToken = storedUser?.tokens?.access;

    if (!accessToken) {
      console.error("Access token not found. User might not be logged in.");
      return;
    }

    axios
      .get('http://localhost:8000/api/user-count/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setUserCount(res.data.total_users);
      })
      .catch((err) => {
        console.error('Error fetching user count:', err.response?.data || err.message);
      });

     axios
      .get('http://localhost:8000/api/total-recognized-faces/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setRecognizedTotal(res.data.total_recognized_faces))
      .catch((err) => console.error('Error fetching total recognized faces:', err));

    axios
      .get('http://localhost:8000/api/total-rooms/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setRoomCount(res.data.total_rooms))
      .catch((err) => console.error('Error fetching total room count:', err));
  }, []);

   
  const menuItems = [
    { icon: <User size={20} className="icon" />, label: 'Registered Users', to: '/admin/users' },
    {
    icon: <ListChecks size={20} className="icon" style={{ color: '#1558c1' }} />,
    label: 'Recognized List',
    to: '/admin/attendance',
  },
  {
    icon: <DoorOpen size={20} className="icon" style={{ color: '#1558c1' }} />,
    label: 'Room List',
    to: '/admin/rooms',
  },
    { icon: <Settings size={20} className="icon" />, label: 'System Settings', to: '/admin/settings' },
  ];


  const stats = [
    { icon: '👤', label: `Total Users: ${userCount}` },
    { icon: '✅', label: `Total Recognized Faces: ${recognizedTotal}` },
    { icon: '🚪', label: `Rooms Created: ${roomCount}` },
    { icon: '⚠️', label: 'Unrecognized Attempts: 5' },
  ];


  const logs = [
    { time: '10:05 AM', user: 'John Doe', confidence: '97%', status: 'Matched', color: '#34a853' },
    { time: '10:18 AM', user: 'Unknown', confidence: '52%', status: 'Unmatched', color: '#ea4335' },
  ];

  return (
    <div className="admin-wrapper">
      {/* Header */}
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
          <button
            onClick={handleLogout}
            className="btn outline"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Admin Panel</h2>
          <ul>
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <Link to={item.to} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.icon} {item.label}
                </Link>
              </li>
            ))}
          </ul>

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
