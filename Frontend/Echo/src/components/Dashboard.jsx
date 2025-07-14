import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import logo from '../img/logo.png';

const Dashboard = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = uuidv4();
    navigate(`/select-purpose/${roomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    const roomId = e.target.roomId.value.trim();
    if (roomId) {
      navigate(`/call/${roomId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.username || 'User';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, #0f141f, #04060a)',
        fontFamily: "'Share Tech Mono', monospace",
        color: '#00fff7',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1.5px solid #00fff7',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(10, 25, 45, 0.95)',
          boxShadow: '0 0 10px #00fff7',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="EchoFace Logo" style={{ height: 40 }} />
        </Link>

        <nav>
          <ul
            style={{
              display: 'flex',
              gap: '24px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              fontWeight: '600',
              fontSize: '1rem',
            }}
          >
            <li>
              <a
                href="#about"
                style={{
                  color: '#00fff7',
                  textDecoration: 'none',
                  textShadow: '0 0 4px #00fff7',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0080ff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#00fff7')}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#features"
                style={{
                  color: '#00fff7',
                  textDecoration: 'none',
                  textShadow: '0 0 4px #00fff7',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0080ff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#00fff7')}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#contact"
                style={{
                  color: '#00fff7',
                  textDecoration: 'none',
                  textShadow: '0 0 4px #00fff7',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0080ff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#00fff7')}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#00ffea',
              textShadow: '0 0 4px #00fff7',
            }}
          >
            Hello, {username}
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#b12d25',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1rem',
              boxShadow: '0 0 8px #b12d25',
              transition: 'background-color 0.3s ease',
              userSelect: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8e1f1a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#b12d25')}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 2rem',
          maxWidth: '480px',
          margin: '0 auto',
          flexDirection: 'column',
        }}
      >
        <h1
          style={{
            fontWeight: '700',
            fontSize: '2.2rem',
            marginBottom: '1.5rem',
            textShadow: '0 0 10px #00fff7',
          }}
        >
          EchoFace Video Calling
        </h1>

        <button
          onClick={createRoom}
          style={{
            background:
              'linear-gradient(45deg, #00fff7, #00d9f7, #0080ff)',
            border: 'none',
            color: '#010a14',
            fontWeight: '700',
            padding: '14px 0',
            width: '100%',
            fontSize: '1.1rem',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow:
              '0 0 8px #00fff7, 0 0 20px #00d9f7, 0 0 30px #0080ff',
            transition: 'box-shadow 0.3s ease',
            marginBottom: '2rem',
            letterSpacing: '1.5px',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow =
              '0 0 20px #00fff7, 0 0 40px #00d9f7, 0 0 60px #0080ff')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow =
              '0 0 8px #00fff7, 0 0 20px #00d9f7, 0 0 30px #0080ff')
          }
        >
          Create New Meeting
        </button>

        <form
          onSubmit={joinRoom}
          style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}
        >
          <input
            type="text"
            name="roomId"
            placeholder="Enter Room ID to Join"
            required
            style={{
              flex: 1,
              backgroundColor: '#020e1a',
              border: '2px solid #00fff7',
              borderRadius: '10px',
              color: '#00fff7',
              padding: '12px 16px',
              fontSize: '1rem',
              fontFamily: "'Share Tech Mono', monospace",
              outline: 'none',
              boxShadow: 'inset 0 0 8px #00fff7',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#0080ff';
              e.currentTarget.style.boxShadow = 'inset 0 0 14px #0080ff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#00fff7';
              e.currentTarget.style.boxShadow = 'inset 0 0 8px #00fff7';
            }}
          />
          <button
            type="submit"
            style={{
              background:
                'linear-gradient(45deg, #b12d25, #8e1f1a, #b12d25)',
              border: 'none',
              color: '#fff',
              fontWeight: '700',
              padding: '14px 20px',
              fontSize: '1rem',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow:
                '0 0 10px #b12d25, 0 0 20px #7f1d18',
              transition: 'box-shadow 0.3s ease',
              letterSpacing: '1.2px',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                '0 0 20px #b12d25, 0 0 40px #7f1d18')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                '0 0 10px #b12d25, 0 0 20px #7f1d18')
            }
          >
            Join Meeting
          </button>
        </form>
      </main>
    </div>
  );
};

export default Dashboard;
