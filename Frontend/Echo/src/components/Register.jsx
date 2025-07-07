import React, { useState } from 'react';
import './register.css';
import LoginLogo from '../img/login_logo.png';
import { Link } from 'react-router-dom';
import axios from "axios";

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const formData = {
            name: username,
            email: email,
            password: password
        };

        try {
            const response = await axios.post(
                "http://localhost:8000/signup/",
                formData
            );
            console.log(response);
            if (response.status === 201) {
                alert("Registration successful!");
                // Redirect to login or dashboard, etc.
                window.location.href = '/login'; // Redirect to login page
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
    };

    return (
        <div className="register">
            <div className="register__container">
                <div className="register-form">
                    <div className="register-form__logo-container">
                        <img src={LoginLogo } className="register-form__logo" alt="AI Logo" />
                    </div>
                    <p className="register-form__second-text">Register to access your attendance records!</p>
                    <div>
                        <form method="post" onSubmit={handleSubmit} className="register__actual-form">
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
                                    id="register_password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                                <i 
                                    className={`bx ${passwordVisible ? 'bx-hide' : 'bx-show'}`} 
                                    id={`bx-${passwordVisible ? 'hide' : 'show'}-register`} 
                                    onClick={togglePasswordVisibility} 
                                ></i>
                            </div>
                            <div className="register-form__inputs">
                                <input 
                                    type={confirmPasswordVisible ? "text" : "password"} 
                                    name="confirm_password" 
                                    placeholder="Confirm Password *" 
                                    className="password-input" 
                                    id="register_confirm_password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                />
                                <i 
                                    className={`bx ${confirmPasswordVisible ? 'bx-hide' : 'bx-show'}`} 
                                    id={`bx-${confirmPasswordVisible ? 'hide' : 'show'}-confirm`} 
                                    onClick={toggleConfirmPasswordVisibility} 
                                ></i>
                            </div>
                            <input type="submit" value="Register" className="register-submit" />
                        </form>
                        <p className="register-form__bottom-text">
                            Register to access your attendance records and stay updated with your academic progress.
                        </p>
                        <p className="register-form__login-link">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
