// RoomList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RoomList.css';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const accessToken = storedUser?.tokens?.access;

    axios
      .get('http://localhost:8000/rooms/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setRooms(res.data))
      .catch((err) => console.error('Failed to fetch rooms:', err));
  }, []);

  return (
    <div className="room-wrapper">
      <header className="room-header">Rooms</header>
      <table className="logs-table">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{new Date(room.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
