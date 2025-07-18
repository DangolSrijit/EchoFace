import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png';
import './LearnMore.css';

const LearnMore = () => {
  // Check if user is logged in by presence of "user" in localStorage
  const isLoggedIn = Boolean(localStorage.getItem('user'));

  return (
    <div className="learn-more-page">
      <header className="header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img src={logo} alt="EchoFace Logo" className="logo" />
          </Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="#technology">Technology</a></li>
            <li><a href="#usecases">Use Cases</a></li>
            <li><a href="#team">Our Team</a></li>
          </ul>
        </nav>
        <div className="header-right">
          {!isLoggedIn && (
            <Link to="/login" className="btn filled">Get Started</Link>
          )}
        </div>
      </header>

      <section className="section intro">
        <h1>Discover the Technology Behind EchoFace</h1>
        <p>Built with privacy, precision, and performance in mind.</p>
      </section>

      <section id="technology" className="section">
        <h2>Our Core Technology</h2>
        <p>
          EchoFace uses state-of-the-art artificial intelligence to offer real-time facial and voice authentication. Our system is trained on diverse datasets to ensure accuracy across age, gender, and ethnicity.
        </p>
      </section>

      <section id="usecases" className="section features">
        <h2>Where EchoFace Shines</h2>
        <div className="feature-grid">
          <FeatureCard title="Online Exams" text="Prevent impersonation and cheating during remote tests." />
          <FeatureCard title="Secure Interviews" text="Verify candidates before and during online interviews." />
          <FeatureCard title="Business Meetings" text="Ensure only authorized users access sensitive discussions." />
          <FeatureCard title="Onboarding & KYC" text="Speed up verification for new users or clients." />
        </div>
      </section>

      <section id="team" className="section">
        <h2>Meet the Team</h2>
        <p>
          Our passionate engineers, designers, and AI researchers work tirelessly to keep EchoFace secure, inclusive, and fast.
        </p>
      </section>

      <footer className="footer">
        <p>&copy; 2025 EchoFace. Powered by Innovation.</p>
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

export default LearnMore;
