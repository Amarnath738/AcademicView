import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const API_BASE_URL = 'http://localhost:8080/api';

const Login = ({ setRole }) => {
    const [showAuthButtons, setShowAuthButtons] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [role, setLocalRole] = useState('student'); // Default role
    const [studentDetails, setStudentDetails] = useState({
        firstname: '',
        lastname: '',
        interested: '',
        pursuing: '',
        degree: '',
        rollNo: '',
    });
    const [mentorDetails, setMentorDetails] = useState({
        firstname: '',
        lastname: '',
        experience: '',
        degree: '',
        skill: '',
        department: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('loggedInUser', email);

            setRole(role); // Update role in the parent component

            // Navigate based on role
            if (role === 'student') {
                navigate('/student');
            } else if (role === 'mentor') {
                navigate('/mentor');
            } else if (role === 'admin') {
                navigate('/admin');
            } else {
                setErrorMessage('Role not recognized.');
            }
        } catch (error) {
            setErrorMessage('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        if (!email.includes('@')) {
            setErrorMessage('Please enter a valid email address.');
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                email,
                password,
                role,
                ...(role === 'student' ? studentDetails : mentorDetails),
            };

            await axios.post(`${API_BASE_URL}/register`, payload);
            alert('Registration successful! You can now log in.');
            setIsLogin(true);
            setShowAuthButtons(true);
        } catch (error) {
            setErrorMessage('Registration failed. Email already used.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStudentChange = (e) => {
        setStudentDetails({
            ...studentDetails,
            [e.target.name]: e.target.value,
        });
    };

    const handleMentorChange = (e) => {
        setMentorDetails({
            ...mentorDetails,
            [e.target.name]: e.target.value,
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password'); // Navigate to a password recovery page
    };

    return (
        <div className="login-container">
            {showAuthButtons ? (
                <div className="auth-buttons">
                    <h1 style={{ color: 'greenyellow', fontSize: '30px', textShadow: '2px 2px 4px black' }}>
                        Welcome to AcademicView Dashboard
                    </h1>
                    <button onClick={() => { setIsLogin(true); setShowAuthButtons(false); }}>Sign In</button>
                    <button onClick={() => { setIsLogin(false); setShowAuthButtons(false); }}>Sign Up</button>
                </div>
            ) : isLogin ? (
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                            {showPassword ? '👁' : '🙈'}
                        </span>
                    </div>
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <button type="button" className="forgot-password-button" onClick={handleForgotPassword}>
                        Forgot Password?
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegister}>
                    <h1>Register</h1>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                            {showPassword ? '👁' : '🙈'}
                        </span>
                    </div>
                    <div>
                        <select value={role} onChange={(e) => setLocalRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="mentor">Mentor</option>
                        </select>
                    </div>
                    {role === 'student' && (
                        <div className="student-details">
                            <input
                                type="text"
                                placeholder="First Name"
                                name="firstname"
                                value={studentDetails.firstname}
                                onChange={handleStudentChange}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="lastname"
                                value={studentDetails.lastname}
                                onChange={handleStudentChange}
                            />
                            <input
                                type="text"
                                placeholder="Interested"
                                name="interested"
                                value={studentDetails.interested}
                                onChange={handleStudentChange}
                            />
                            <input
                                type="text"
                                placeholder="Pursuing"
                                name="pursuing"
                                value={studentDetails.pursuing}
                                onChange={handleStudentChange}
                            />
                            <input
                                type="text"
                                placeholder="Degree"
                                name="degree"
                                value={studentDetails.degree}
                                onChange={handleStudentChange}
                            />
                            <input
                                type="text"
                                placeholder="Roll No"
                                name="rollNo"
                                value={studentDetails.rollNo}
                                onChange={handleStudentChange}
                            />
                        </div>
                    )}
                    {role === 'mentor' && (
                        <div className="mentor-details">
                            <input
                                type="text"
                                placeholder="First Name"
                                name="firstname"
                                value={mentorDetails.firstname}
                                onChange={handleMentorChange}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="lastname"
                                value={mentorDetails.lastname}
                                onChange={handleMentorChange}
                            />
                            <input
                                type="text"
                                placeholder="Experience"
                                name="experience"
                                value={mentorDetails.experience}
                                onChange={handleMentorChange}
                            />
                            <input
                                type="text"
                                placeholder="Degree"
                                name="degree"
                                value={mentorDetails.degree}
                                onChange={handleMentorChange}
                            />
                            <input
                                type="text"
                                placeholder="Skill"
                                name="skill"
                                value={mentorDetails.skill}
                                onChange={handleMentorChange}
                            />
                            <input
                                type="text"
                                placeholder="Department"
                                name="department"
                                value={mentorDetails.department}
                                onChange={handleMentorChange}
                            />
                        </div>
                    )}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Login;
