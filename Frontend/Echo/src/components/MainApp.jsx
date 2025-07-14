import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';

const MainApp = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", backgroundColor: '#0f141f', color: '#00fff7', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #00fff7', padding: '1rem 0', backgroundColor: '#0a1018' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="Home">
            <img src={logo} alt="EchoFace Logo" style={{ height: 50, marginRight: 12 }} />
          </Link>
          <nav>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '2.5rem', margin: 0, padding: 0 }}>
              <li><a href="#about" style={navLinkStyle} aria-label="About section">About</a></li>
              <li><a href="#features" style={navLinkStyle} aria-label="Features section">Features</a></li>
              <li><a href="#contact" style={navLinkStyle} aria-label="Contact section">Contact</a></li>
              {isLoggedIn ? (
                <li>
                  <button onClick={handleLogout} style={logoutBtnStyle}>Logout</button>
                </li>
              ) : (
                <li>
                  <Link to="/login" className="login-btn" style={loginBtnStyle}>Login</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero" style={heroStyle}>
        <div className="container" style={{ maxWidth: 700, margin: '0 auto', padding: '4rem 1rem', backgroundColor: 'rgba(0,255,247,0.1)', borderRadius: 12, boxShadow: '0 0 15px #00fff7' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', lineHeight: 1.1, textShadow: '0 0 10px #00fff7' }}>
            Your Gateway to <br />Smart Attendance Management
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: '#a0ffff', fontWeight: '500' }}>
            Streamline your administrative tasks and enhance workforce tracking with our AI-powered attendance system.
          </p>
          <a href="#features" style={heroBtnStyle}>Learn More</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={aboutSectionStyle}>
        <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '4rem 1rem' }}>
          <h2 style={{ ...sectionTitleStyle, textAlign: 'left' }}>About Our System</h2>
          <p style={{ ...sectionTextStyle, textAlign: 'left', maxWidth: '650px' }}>
            Our EchoFace System leverages advanced facial recognition technology to provide a seamless and accurate face tracking solution.
            Designed for ease of use and maximum efficiency, it simplifies face detection, voice detection, and attendance management for educational institutions, businesses, and organizations.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={featuresSectionStyle}>
        <div className="container" style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1rem' }}>
          <h2 style={{ ...sectionTitleStyle, color: '#00d7f7', marginBottom: '2.5rem' }}>Features</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '2rem', flexWrap: 'wrap' }}>
            <FeatureCard icon="🧠" title="Facial Recognition" text="Automate attendance tracking with precise facial recognition technology." />
            <FeatureCard icon="⏱️" title="Real-Time Reporting" text="Get instant access to attendance data and generate comprehensive reports." />
            <FeatureCard icon="🔌" title="Easy Integration" text="Seamlessly integrate with existing systems and platforms." />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={contactSectionStyle}>
        <div className="container" style={{ maxWidth: 600, margin: '0 auto', padding: '4rem 1rem' }}>
          <div style={contactCardStyle}>
            <h2 style={{ ...sectionTitleStyle, color: '#00fff7', marginBottom: '1rem', textAlign: 'center' }}>Contact Us</h2>
            <p style={{ ...sectionTextStyle, textAlign: 'center', color: '#80fff7', marginBottom: '2rem' }}>
              If you have any questions or would like to learn more, please reach out to us!
            </p>
            <form action="submit_form.php" method="post" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" name="name" placeholder="Your Name" required style={inputStyle} />
              <input type="email" name="email" placeholder="Your Email" required style={inputStyle} />
              <textarea name="message" placeholder="Your Message" required rows="5" style={textareaStyle}></textarea>
              <button type="submit" style={contactBtnStyle}>Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #008080', padding: '1rem 0', textAlign: 'center', color: '#008080' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p>&copy; 2025 EchoFace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, text }) => (
  <div style={featureCardStyle} tabIndex={0} aria-label={`${title} feature`}>
    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
    <h3 style={featureTitleStyle}>{title}</h3>
    <p style={featureTextStyle}>{text}</p>
  </div>
);

// Styles
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
const loginBtnStyle = {
  backgroundColor: '#00fff7',
  color: '#010a14',
  padding: '8px 20px',
  borderRadius: '12px',
  fontWeight: '700',
  textDecoration: 'none',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  boxShadow: '0 0 8px #00fff7',
  cursor: 'pointer',
};
const logoutBtnStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #00fff7',
  color: '#00fff7',
  padding: '8px 20px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};
const heroStyle = {
  background: 'linear-gradient(135deg, #004d66 0%, #007a99 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '380px',
};
const heroBtnStyle = {
  backgroundColor: '#00fff7',
  color: '#010a14',
  padding: '14px 36px',
  borderRadius: '30px',
  fontWeight: '700',
  textDecoration: 'none',
  fontSize: '1.3rem',
  boxShadow: '0 0 15px #00fff7',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  userSelect: 'none',
};
const sectionTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  textShadow: '0 0 7px #00fff7',
  marginBottom: '1.5rem',
  letterSpacing: '1px',
};
const sectionTextStyle = {
  fontSize: '1.1rem',
  lineHeight: 1.6,
  color: '#80fff7',
};
const aboutSectionStyle = {
  backgroundColor: '#121a25',
  paddingTop: '3rem',
  paddingBottom: '3rem',
  backgroundImage: 'radial-gradient(circle at center, #003344 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};
const featuresSectionStyle = {
  backgroundColor: '#0a1f2e',
  borderRadius: '12px 12px 0 0',
  margin: '0 1rem',
  paddingTop: '3rem',
  paddingBottom: '4rem',
};
const featureCardStyle = {
  flex: '1 1 30%',
  backgroundColor: '#003340',
  borderRadius: '20px',
  padding: '2rem 1.5rem',
  boxShadow: '0 0 15px #00fff7',
  textAlign: 'center',
  minWidth: '280px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'default',
  color: '#a0f9ff',
  userSelect: 'none',
};
const featureTitleStyle = {
  fontSize: '1.6rem',
  marginBottom: '1rem',
  fontWeight: '700',
  color: '#00fff7',
};
const featureTextStyle = {
  fontSize: '1rem',
  color: '#8efcff',
};
const contactSectionStyle = {
  background: 'linear-gradient(120deg, #001a22 0%, #003340 100%)',
  margin: '2rem 1rem',
  borderRadius: '20px',
  boxShadow: '0 0 25px #00fff7',
};
const contactCardStyle = {
  backgroundColor: '#071a26',
  padding: '2rem 3rem',
  borderRadius: '20px',
  boxShadow: '0 0 15px #00fff7',
};
const inputStyle = {
  padding: '14px 18px',
  borderRadius: '12px',
  border: '1px solid #00fff7',
  backgroundColor: '#0f141f',
  color: '#00fff7',
  fontFamily: "'Share Tech Mono', monospace",
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};
const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
};
const contactBtnStyle = {
  backgroundColor: '#00fff7',
  color: '#010a14',
  padding: '14px 30px',
  borderRadius: '30px',
  fontWeight: '700',
  fontSize: '1.2rem',
  boxShadow: '0 0 15px #00fff7',
  cursor: 'pointer',
  border: 'none',
  userSelect: 'none',
};

export default MainApp;
