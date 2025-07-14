import React from 'react';
import logo from '../img/logo.png';
import { Link, useNavigate } from 'react-router-dom';

export default function MainAfterCall() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div
      style={{
        fontFamily: "'Share Tech Mono', monospace",
        backgroundColor: '#0f141f',
        color: '#00fff7',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid #00fff7',
          padding: '1rem 0',
          backgroundColor: '#0a1018',
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            to="/"
            className="logo"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            aria-label="Home"
          >
            <img src={logo} alt="EchoFace Logo" style={{ height: 50, marginRight: 12 }} />
          </Link>
          <nav>
            <ul
              style={{
                display: 'flex',
                listStyle: 'none',
                gap: '2.5rem',
                margin: 0,
                padding: 0,
              }}
            >
              <li>
                <a href="#about" style={navLinkStyle} aria-label="About section">
                  About
                </a>
              </li>
              <li>
                <a href="#features" style={navLinkStyle} aria-label="Features section">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" style={navLinkStyle} aria-label="Contact section">
                  Contact
                </a>
              </li>
              <li>
                {/* Logout button replaces login here */}
                <button
                  onClick={handleLogout}
                  style={logoutBtnStyle}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', textShadow: '0 0 10px #00fff7' }}>
          Welcome to the Meeting App
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#a0ffff', fontWeight: '500' }}>
          This is your main page after leaving a call.
        </p>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #008080',
          padding: '1rem 0',
          textAlign: 'center',
          color: '#008080',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p>&copy; 2025 EchoFace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Styles for nav links (copied from your MainApp)
const navLinkStyle = {
  color: '#00fff7',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '1rem',
  transition: 'color 0.3s ease',
  cursor: 'pointer',
  outline: 'none',
  userSelect: 'none',
};

// Logout button style (based on your login button style, but as a button)
const logoutBtnStyle = {
  backgroundColor: '#b12d25',
  color: '#fff',
  padding: '8px 20px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '1rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 0 8px #b12d25',
  userSelect: 'none',
};
