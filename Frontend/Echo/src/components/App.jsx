import { Routes, Route } from 'react-router-dom';
import './style.css';

import Login from './Login';
import RegisterParticipants from './RegisterParticipants';
import Register from './Register';
import MainApp from './MainApp';
import User from './User';
import AdminPage from './AdminPage';
import Dashboard from './Dashboard';
import VideoCall from './videocall';
import PrivateRoute from './PrivateRoute';
import SelectPurpose from './SelectPurpose';
import PreCallSettings from './PreCallSettings'; 
import MainAfterCall from './MainAfterCall';
import LearnMore from './LearnMore'; 
import RegisteredUser from './RegisteredUsers';
import AttendanceList from './AttendanceList';
import RoomList from './RoomList';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/signupparticipants" element={<RegisterParticipants />} />
      <Route path="/user" element={<User />} />
      <Route path="/learn-more" element={<LearnMore />} /> {/* ✅ New route */}

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/AdminPage" 
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/select-purpose/:roomName" 
        element={
          <PrivateRoute>
            <SelectPurpose />
          </PrivateRoute>
        }
      />
      <Route 
        path="/pre-call-settings/:roomName" 
        element={
          <PrivateRoute>
            <PreCallSettings />
          </PrivateRoute>
        }
      />
      <Route 
        path="/call/:roomName" 
        element={
          <PrivateRoute>
            <VideoCall />
          </PrivateRoute>
        } 
      />

      
        <Route path="/admin/face-logs" element={<div>Face Recognition Logs</div>} />
        <Route path="/admin/voice-logs" element={<div>Voice Detection Logs</div>} />
        <Route path="/admin/settings" element={<div>System Settings</div>} />
        <Route path="/admin/users" element={<RegisteredUser />} />
        {/* Add other components like /face-logs etc. if needed */}
      
      <Route path="/main-after-call" element={<MainAfterCall />} />
      <Route path="/admin/attendance" element={<AttendanceList />} />
      <Route path="/admin/rooms" element={<RoomList />} />
    </Routes>
  );
}

export default App;
