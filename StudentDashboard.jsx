import React from "react";
import './StudentPage.css';
import Profile from "./StudentProfile";
import { Link, Route, Routes } from "react-router-dom";

const Student = () => {
    return (
        <div className="student-dashboard" style={{ padding: "20px", textAlign: "center" }}>
            {/* Navbar */}
            <nav className="navbar">
                <ul className="nav-list">
                    <li>
                        <Link to="/student/home" className="nav-link">Home</Link>
                    </li>
                    <li>
                        <Link to="/student/profile" className="nav-link">Profile</Link>
                    </li>
                    <li>
                        <Link to="/student/courses" className="nav-link">Courses</Link>
                    </li>
                    <li>
                        <Link to="/student/timetable" className="nav-link">Timetable</Link>
                    </li>
                    <li>
                        <Link to="/student/calendar" className="nav-link">Calendar</Link>
                    </li>
                    <li>
                        <Link to="/logout" className="nav-link">Logout</Link>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="content">
                <h1>Welcome to the Student Dashboard</h1>
                <div className="student-courses">
                    <h2>Courses</h2>
                    {/* Course management features here */}
                </div>
                <div className="student-timetable">
                    <h2>Timetable</h2>
                    {/* Timetable features here */}
                </div>
                <div className="student-edit-options">
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

export default StudentDashboard;
