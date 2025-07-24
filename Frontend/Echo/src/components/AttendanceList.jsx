// AttendanceList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AttendanceList.css';

const AttendanceList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const accessToken = storedUser?.tokens?.access;

    axios
      .get('http://localhost:8000/attendance/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setRecords(res.data))
      .catch((err) => console.error('Failed to fetch attendance:', err));
  }, []);

  return (
    <div className="attendance-wrapper">
      <header className="attendance-header">Attendance Records</header>
      <table className="logs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Name</th>
            <th>Date</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{rec.student_name}</td>
              <td>{rec.date}</td>
              <td>{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceList;
