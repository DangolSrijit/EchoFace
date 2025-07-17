import { Routes, Route } from 'react-router-dom'; // ✅ remove BrowserRouter/Router
import './style.css';

import Login from './Login';
import RegisterParticipant from './RegisterParticipant';
import MainApp from './MainApp';
import User from './User';
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
      <Route path="/signup" element={<RegisterParticipant />} />
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
