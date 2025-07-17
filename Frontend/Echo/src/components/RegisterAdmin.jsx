import React, { useState } from 'react';
import './RegisterAdmin.css';
import LoginLogo from '../img/login_logo.png';
import { Link } from 'react-router-dom';
import axios from "axios";
import { Eye, EyeOff } from 'lucide-react'; // 👈 icon import

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [role, setRole] = useState('participant'); // default

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = {
      name: username,
      email,
      password,
      role,
    };

    try {
      const response = await axios.post("http://localhost:8000/signup/", formData);
      if (response.status === 201) {
        alert("Registration successful!");
        window.location.href = '/login';
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration", error);
      alert("An error occurred. Please try again later.");
    }

    // Reset form
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('participant');
  };

  return (
    <div className="register">
      <div className="register__container">
        <div className="register-form">
          <div className="register-form__logo-container">
            <img src={LoginLogo} className="register-form__logo" alt="AI Logo" />
          </div>
          <p className="register-form__second-text">
           Register to access records and stay updated!
          </p>

          {/* Role toggle buttons */}
          <div className="register-role-toggle">
            <button
              type="button"
              className={`register-role-button ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Register as Admin
            </button>
            <button
              type="button"
              className={`register-role-button ${role === 'participant' ? 'active' : ''}`}
              onClick={() => setRole('participant')}
            >
              Register as Participant
            </button>
          </div>

          <form onSubmit={handleSubmit} className="register__actual-form" noValidate>
            <div className="register-form__inputs">
              <input
                type="text"
                name="username"
                placeholder="Username*"
                className="name-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="register-form__inputs">
              <input
                type="email"
                name="email"
                placeholder="Email*"
                className="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="register-form__inputs password-wrapper">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password*"
                className="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="icon-toggle"
                onClick={togglePasswordVisibility}
                aria-label="Toggle Password"
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="register-form__inputs password-wrapper">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirm_password"
                placeholder="Confirm Password*"
                className="password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="icon-toggle"
                onClick={toggleConfirmPasswordVisibility}
                aria-label="Toggle Confirm Password"
              >
                {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <input type="submit" value="Signup" className="register-submit" />
          </form>

          <p className="register-form__bottom-text">
            Register to access your records and stay informed about all your important updates and opportunities.
          </p>
          <p className="register-form__login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;