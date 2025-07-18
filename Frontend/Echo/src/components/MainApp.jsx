// MainApp.jsx (Google-Style Themed React Component)
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import bgimg from '../img/bgimg.jpg';
import './MainApp.css';

const MainApp = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="main-app">
      <header className="header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img src={logo} alt="EchoFace Logo" className="logo" />
          </Link>
        </div>

        <nav className="nav">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
            {isLoggedIn && <li><Link to="/user">Meeting Room</Link></li>}
          </ul>
        </nav>

        <div className="header-right">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn outline">Logout</button>
          ) : (
            <Link to="/login" className="btn filled">Login</Link>
          )}
        </div>
      </header>

      <section className="hero" style={{ backgroundImage: `url(${bgimg})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Smart Online Meetings<br />Made Simple</h1>
          <p>AI-powered facial and voice recognition for secure digital interactions.</p>
          <Link to="/learn-more" className="btn filled">Learn more</Link>
        </div>
      </section>

      <section id="about" className="section about">
        <h2>About EchoFace</h2>
        <p>
          EchoFace combines advanced facial and voice recognition technology to simplify and secure your online exams,
          interviews, and meetings. Built for educational institutions and modern businesses.
        </p>
      </section>

      <section id="features" className="section features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <FeatureCard title="Facial Recognition" text="Accurate and secure face detection powered by AI." />
          <FeatureCard title="Voice Verification" text="Authenticate users using real-time voice recognition." />
          <FeatureCard title="Live Monitoring" text="Track user presence during online sessions." />
          <FeatureCard title="Detailed Reports" text="Export face & voice data insights instantly." />
        </div>
      </section>

      <section id="contact" className="section contact">
        <h2>Contact Us</h2>
        <p>Have questions? We'd love to hear from you.</p>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required rows="5" />
          <button type="submit" className="btn filled">Send Message</button>
        </form>
      </section>

      <footer className="footer">
        <p>&copy; 2025 EchoFace. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, text }) => (
  <div className="feature-card">
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export default MainApp;
