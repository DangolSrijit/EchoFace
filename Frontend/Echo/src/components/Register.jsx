


import React, { useState } from 'react';
import './Register.css';
import LoginLogo from '../img/login_logo.png';
import { Link } from 'react-router-dom';
import axios from "axios";
import { Eye, EyeOff } from 'lucide-react'; // 👈 icon import

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nicImage, setNicImage] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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


    const handleNICImageChange = (e) => {
        setNicImage(e.target.files[0]);
    };

    const handleFaceRegister = () => {
        alert("Face registration feature coming soon!");
        // Future logic for face capture/integration here
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const formData = new FormData();
        formData.append('name', username);
        formData.append('email', email);
        formData.append('password', password);

        if (nicImage) {
            formData.append('nic_image', nicImage);
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/signup/",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

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

        // Reset form fields
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setNicImage(null);
    };

    return (
        <div className="register">
            <div className="register__container">
                <div className="register-form">
                    <div className="register-form__logo-container">
                        <img src={LoginLogo} className="register-form__logo" alt="AI Logo" />
                    </div>
                    <p className="register-form__second-text">Register to access your attendance records!</p>
                    <form method="post" onSubmit={handleSubmit} className="register__actual-form" encType="multipart/form-data">
                        <div className="register-form__inputs">
                            <input 
                                type="text"
                                name="username"
                                placeholder="Username*"
                                className="name-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                            />
                        </div>
                        <div className="register-form__inputs">
                            <input 
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                placeholder="Password *"
                                className="password-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <i 
                                className={`bx ${passwordVisible ? 'bx-hide' : 'bx-show'}`}
                                onClick={togglePasswordVisibility}
                            ></i>
                        </div>
                        <div className="register-form__inputs">
                            <input 
                                type={confirmPasswordVisible ? "text" : "password"}
                                name="confirm_password"
                                placeholder="Confirm Password *"
                                className="password-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <i 
                                className={`bx ${confirmPasswordVisible ? 'bx-hide' : 'bx-show'}`}
                                onClick={toggleConfirmPasswordVisibility}
                            ></i>
                        </div>
                        <p>Upload your NIC image:</p>
                        <div className="register-form__inputs">
                            <input 
                                type="file"
                                name="nic_image"
                                className="email-input"
                                accept="image/*"
                                onChange={handleNICImageChange}
                            />
                        </div>
                        <input 
                            type="button" 
                            value="Register Face Data" 
                            className="register-submitFace" 
                            onClick={handleFaceRegister}
                        />
                        <input type="submit" value="Register" className="register-submit" />
                    </form>
                    <p className="register-form__bottom-text">
                        Register to access your attendance records and enable biometric verification for secure access.
                    </p>
                    <p className="register-form__login-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </div>
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