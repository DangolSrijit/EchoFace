import logo from '../img/logo.png';
import { Link } from 'react-router-dom';

const MainApp = () => {
  return (
    <div>
    <header>    
        <div className="container">
            <a href="#" className="logo">
                <img src={logo} alt="AI Attendance Logo" />
            </a>
            <nav>
                <ul>
                    <li><a href="#about">About</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li> <Link to="/login" className="login-btn">Login</Link></li>
                </ul>
            </nav>
        </div>
    </header>

    <section className="hero">
        <div className="container">
            <h2>Your Gateway to Smart Attendance Management</h2>
            <p>Streamline your administrative tasks and enhance workforce tracking with our AI-powered attendance system.</p>
            <a href="#features" className="btn">Learn More</a>
        </div>
    </section>

    <section id="about" className="about">
        <div className="container">
            <h2>About Our System</h2>
            <p>Our EchoFace System leverages advanced facial recognition technology to provide a seamless and accurate face tracking solution. Designed for ease of use and maximum efficiency, it simplifies face detection voice detection and attendance management for educational institutions, businesses, and organizations.</p>
        </div>
    </section>

    <section id="features" className="features">
        <div className="container">
            <h2>Features</h2>
            <div className="feature-list">
                <div className="feature">
                    <h3>Facial Recognition</h3>
                    <p>Automate attendance tracking with precise facial recognition technology.</p>
                </div>
                <div className="feature">
                    <h3>Real-Time Reporting</h3>
                    <p>Get instant access to attendance data and generate comprehensive reports.</p>
                </div>
                <div className="feature">
                    <h3>Easy Integration</h3>
                    <p>Seamlessly integrate with existing systems and platforms.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" className="contact">
        <div className="container">
            <h2>Contact Us</h2>
            <p>If you have any questions or would like to learn more, please reach out to us!</p>
            <form action="submit_form.php" method="post">
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email" required />
                <textarea name="message" placeholder="Your Message" required></textarea>
                <button type="submit" className="btn">Send Message</button>
            </form>
        </div>
    </section>

    <footer>
        <div className="container">
            <p>&copy; 2025 EchoFace. All rights reserved.</p>
        </div>
    </footer>
</div>
);
};


export default MainApp;
