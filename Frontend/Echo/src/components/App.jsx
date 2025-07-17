import { Routes, Route } from 'react-router-dom'; // ✅ remove BrowserRouter/Router
import './style.css';

import Login from './Login';
import RegisterParticipants from './RegisterParticipants';
import Register from './Register';
import MainApp from './MainApp';
import User from './User';
import Admin from './AdminPage';
import Dashboard from './Dashboard';
import VideoCall from './videocall';
import PrivateRoute from './PrivateRoute';
import SelectPurpose from './SelectPurpose';
import PreCallSettings from './PreCallSettings'; 
import MainAfterCall from './MainAfterCall';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainApp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/signupparticipants" element={<RegisterParticipants />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/user" element={<User />} />

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
        path="/admin" 
        element={
          <PrivateRoute>
            <Admin />
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
      <Route 
        path="/main-after-call" 
        element={
          <MainAfterCall />
        } 
      />

    </Routes>
  );
}

export default App;
