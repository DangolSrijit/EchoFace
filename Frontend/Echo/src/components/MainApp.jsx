// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import logo from '../img/logo.png';
// import './MainApp.css'; // Import the CSS file
// import bgimg from '../img/bgimg.jpg'; // Import background image

// const MainApp = () => {
//   const navigate = useNavigate();
//   const isLoggedIn = localStorage.getItem('user');

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   return (
//     <div className="main-app">
//       <header className="main-header">
//         <div className="container header-container">
//           <Link to="/" className="logo">
//             <img src={logo} alt="AI Attendance Logo" />
//           </Link>
//           <nav>
//             <ul className="nav-links">
//               <li><a href="#about">About</a></li>
//               <li><a href="#features">Features</a></li>
//               <li><a href="#contact">Contact</a></li>
//               {isLoggedIn && (
//                 <section id="meeting-room" className="meeting-room">
//                   <div className="container">
//                     <Link to="/user" className="meeting-room-btn">Meeting Room</Link>
//                   </div>
//                 </section>
//               )}
//               {isLoggedIn ? (
//                 <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
//               ) : (
//                 <li><Link to="/login" className="login-btn">Login</Link></li>
//               )}
              

//             </ul>
//           </nav>
//         </div>
//       </header>

//       {/* ✅ Hero section with full-screen background */}
//       <section
//         className="hero"
//         style={{ backgroundImage: `url(${bgimg})` }}
//       >
//         <div className="container hero-content">
//           <h1>Your Gateway to <br />Smart Online Call</h1>
//           <p>AI face recognition for secure access to your online exams and interviews.</p>
//           <a href="#features" className="hero-btn">Learn More</a>
//         </div>
//       </section>

//       <section id="about" className="about">
//         <div className="container">
//           <h2>About Our System</h2>
//           <p>Our EchoFace System leverages advanced facial recognition technology to provide a seamless and accurate face tracking solution. Designed for ease of use and maximum efficiency, it simplifies face detection, voice detection, and attendance management for educational institutions, businesses, and organizations.</p>
//         </div>
//       </section>

//       <section id="features" className="features">
//         <div className="container">
//           <h2>Features</h2>
//           <div className="feature-list">
//             <FeatureCard title="Facial Recognition" text="Automate face tracking with precise facial recognition technology." />
//             <FeatureCard title="Real-Time Reporting" text="Get instant access to face & voice data and generate comprehensive reports." />
//             <FeatureCard title="Easy Integration" text="Seamlessly integrate with existing systems and platforms." />
//           </div>
//         </div>
//       </section>

//       <section id="contact" className="contact">
//         <div className="container">
//           <h2>Contact Us</h2>
//           <p>If you have any questions or would like to learn more, please reach out to us!</p>
//           <form action="submit_form.php" method="post">
//             <input type="text" name="name" placeholder="Your Name" required />
//             <input type="email" name="email" placeholder="Your Email" required />
//             <textarea name="message" placeholder="Your Message" required></textarea>
//             <button type="submit" className="contact-btn">Send Message</button>
//           </form>
//         </div>
//       </section>

//       <footer className="main-footer">
//         <div className="container">
//           <p>&copy; 2025 EchoFace. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// const FeatureCard = ({ icon, title, text }) => (
//   <div className="feature-card">
//     <div className="feature-icon">{icon}</div>
//     <h3>{title}</h3>
//     <p>{text}</p>
//   </div>
// );

// export default MainApp;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import './MainApp.css'; // Import your CSS file
import bgimg from '../img/bgimg.jpg';

const MainApp = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="main-app">
      {/* Clean Header */}
      <header className="clean-header">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img src={logo} alt="EchoFace Logo" className="header-logo" />
          </Link>
        </div>

        <nav className="header-nav">
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#contact">Contact</a></li>
            {isLoggedIn && (
              <li>
                <Link to="/user" className="meeting-room-link">Meeting Room</Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-right">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${bgimg})` }}
      >
        <div className="container hero-content">
          <h1>Your Gateway to <br />Smart Online Call</h1>
          <p>AI face recognition for secure access to your online exams and interviews.</p>
          <a href="#features" className="hero-btn">Learn More</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2>About Our System</h2>
          <p>Our EchoFace System leverages advanced facial recognition technology to provide a seamless and accurate face tracking solution. Designed for ease of use and maximum efficiency, it simplifies face detection, voice detection, and attendance management for educational institutions, businesses, and organizations.</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2>Features</h2>
          <div className="feature-list">
            <FeatureCard title="Facial Recognition" text="Automate face tracking with precise facial recognition technology." />
            <FeatureCard title="Real-Time Reporting" text="Get instant access to face & voice data and generate comprehensive reports." />
            <FeatureCard title="Easy Integration" text="Seamlessly integrate with existing systems and platforms." />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <p>If you have any questions or would like to learn more, please reach out to us!</p>
          <form action="submit_form.php" method="post">
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button type="submit" className="contact-btn">Send Message</button>
          </form>
        </div>
      </section>

      <footer className="main-footer">
        <div className="container">
          <p>&copy; 2025 EchoFace. All rights reserved.</p>
        </div>
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
