import React, { useState } from 'react';
import './Login.css';
import LoginLogo from '../img/login_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [emailUsername, setEmailUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Login Submitted:', { emailUsername, password });
        const formData = {
            email: emailUsername,
            password: password
            };

        try {
            const response = await axios.post(
              "http://localhost:8000/login/",
              formData,
              {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
            // console.log(response);
            console.log(response);
            if (response.status === 200) {
                const { tokens, user } = response.data;

                // Save tokens to localStorage
                localStorage.setItem("access_token", tokens.access);
                localStorage.setItem("refresh_token", tokens.refresh);

                // Optionally save user info
                localStorage.setItem("user", JSON.stringify(user));

                // Redirect to dashboard
                navigate("/dashboard");
            } else {
                // handle error (optional)
                alert("Login failed");
            }
            } catch (error) {
            console.error("Error Logging in", error);
            alert("Invalid credentials");
            }
        // Reset form fields
        setEmailUsername('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="login" id="login" style={{ opacity: 1 }}>
            <div className="login__container" id="login__container">
                <div className="login-form">
                    <div className="login-form__logo-container">
                        <img src={LoginLogo} className="login-form__logo" alt="AI Logo" />
                    </div>
                    <p className="login-form__heading-text">Login</p>
                    <p className="login-form__second-text">Your gateway to smart attendance management!</p>

                    <div>
                        <form onSubmit={handleSubmit} className="login__actual-form">
                            <div className="login-form__inputs">
                                <input 
                                    type="text" 
                                    name="email_username" 
                                    value={emailUsername}
                                    onChange={(e) => setEmailUsername(e.target.value)}
                                    placeholder="Email *" 
                                    className="email-input" 
                                    required 
                                />
                            </div>
                            <div className="login-form__inputs">
                                <input 
                                    type={passwordVisible ? "text" : "password"} 
                                    name="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password *" 
                                    className="password-input" 
                                    id="login_password" 
                                    required 
                                />
                                <i 
                                    className={`bx ${passwordVisible ? 'bx-hide' : 'bx-show'}`} 
                                    id={`bx-${passwordVisible ? 'hide' : 'show'}-login`} 
                                    onClick={togglePasswordVisibility} 
                                ></i>
                            </div>
                           <input type="submit" value="Login" className="login-submit" />
                        </form>
                        <Link to='/signup'>
                            <button className="register-button">
                                Register
                            </button>
                        </Link>
                        <p className="login-form__bottom-text">Log in to streamline your administrative tasks and enhance workforce tracking.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
