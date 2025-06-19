import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './style.css';
import Login from './Login'
import Register from './Register';
import MainApp from './MainApp';
import User from './User';


function App() {
  return (
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<User />} />
      </Routes>
  );
}

export default App
