
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisteredUser.css';

const RegisteredUser = () => {
  const [userCount, setUserCount] = useState(0);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const fetchUsers = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const accessToken = storedUser?.tokens?.access;

    if (!accessToken) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:8000/api/user-count/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setUserCount(res.data.total_users))
      .catch((err) =>
        console.error('Error fetching user count:', err.response?.data || err.message)
      );

    axios
      .get('http://localhost:8000/api/registered-users/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setRegisteredUsers(res.data))
      .catch((err) =>
        console.error('Error fetching registered users:', err.response?.data || err.message)
      );
  };

  const handleDelete = (userId) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const accessToken = storedUser?.tokens?.access;

    if (window.confirm('Are you sure you want to delete this user?')) {
      axios
        .delete(`http://localhost:8000/api/delete-user/${userId}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(() => {
          alert('User deleted successfully!');
          fetchUsers(); // refresh list
        })
        .catch((err) => {
          console.error('Error deleting user:', err.response?.data || err.message);
          alert('Failed to delete user.');
        });
    }
  };

  return (
    <div className="registered-wrapper">
      <header className="registered-header">
        <h1>Registered Users</h1>
      </header>

      <section className="stats-container">
        <div className="stat-card">
          <span className="stat-icon">👤</span>
          <span>Total Users: {userCount}</span>
        </div>
      </section>

      <section>
        <h2 className="section-title">User Details</h2>
        <table className="logs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Staff</th>
              <th>Created At</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {registeredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.is_staff ? 'Yes' : 'No'}</td>
                <td>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : 'Invalid Date'}
                </td>
                <td>{user.is_active ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default RegisteredUser;
