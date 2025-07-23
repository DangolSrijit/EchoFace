import React from "react";
import "./User.css";
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import logo from '../img/logo.png';
import face from '../img/face.webp';

function User() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = uuidv4();
    navigate(`/select-purpose/${roomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    const roomId = e.target.roomId.value.trim();
    if (roomId) {
      navigate(`/call/${roomId}`, {
        state: {
          isCreator: false,
          roomId: roomId
        }
      });
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || 'User';

  return (
    <div>
      {/* Clean Header */}
      <header className="clean-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Echoface Logo" className="header-logo" />
          </Link>
        </div>

        <nav className="header-nav">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="header-right">
          <span className="greeting">Hello, {username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Meet Section */}
      <div className="meet-container">
        <div className="meet-left">
          <h1 className="meet-title">Video calls and meetings for everyone</h1>
          <p className="meet-text">Connect, collaborate, and celebrate from anywhere with EchoFace</p>

          <div className="meet-buttons">
            <button className="meet-new-btn" onClick={createRoom}>New meeting</button>

            <form onSubmit={joinRoom} className="meet-join-box">
              <input
                type="text"
                name="roomId"
                placeholder="Enter a code or link"
                required
              />
              <button type="submit" className="meet-join-btn">Join</button>
            </form>
          </div>

          <a href="#learn-more" className="meet-link">Learn more about EchoFace</a>
        </div>

        <div className="meet-right">
          <div className="meet-circle">
            <img src={face} alt="Link sharing" />
          </div>
          <h2>Get a link you can share</h2>
          <p>Click <strong>New meeting</strong> to get a link you can send to people you want to meet with</p>
        </div>
      </div>
    </div>
  );
}

export default User;
