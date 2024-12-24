import React from "react";
import './MentorPage.css';
import Profile from "./MentorProfile";
import { Link, Route, Routes } from "react-router-dom";

const MentorDashboard = () => {
    return (
        <div className="mentor-dashboard" style={{ padding: "20px", textAlign: "center" }}>
            {/* Navbar */}
            <nav className="navbar">
                <ul className="nav-list">
                    <li>
                        <Link to="/mentor/home" className="nav-link">Home</Link>
                    </li>
                    <li>
                        <Link to="/mentor/profile" className="nav-link">Profile</Link>
                    </li>
                    <li>
                        <Link to="/mentor/courses" className="nav-link">Courses</Link>
                    </li>
                    <li>
                        <Link to="/mentor/students" className="nav-link">Students</Link>
                    </li>
                    <li>
                        <Link to="/mentor/calendar" className="nav-link">Calendar</Link>
                    </li>
                    <li>
                        <Link to="/logout" className="nav-link">Logout</Link>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="content">
                <h1>Welcome to the Mentor Dashboard</h1>
                <div className="mentor-stats">
                    <h2>Total Students: {/* Total students count here */}</h2>
                </div>
                <div className="mentor-classroom">
                    <h2>Classroom Management</h2>
                    {/* Classroom management features here */}
                </div>
                <div className="mentor-courses">
                    <h2>Courses</h2>
                    {/* Courses management features here */}
                </div>
                <div className="mentor-student-details">
                    <h2>Students Details</h2>
                    {/* Pass/Fail details here */}
                </div>
                <div className="mentor-calendar">
                    <h2>Calendar of Events</h2>
                    {/* Calendar features here */}
                </div>
                <div className="mentor-edit-options">
                    <h2>Edit Options</h2>
                    {/* Edit options here */}
                </div>
            </div>
            <Routes>
                <Route path="profile" element={<Profile />} />
            </Routes>
        </div>
    );
};

export default MentorDashboard;
