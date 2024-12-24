import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Profile from "./StudentProfile"; // Import Profile correctly
import './StudentPage.css';
import { useNavigate } from "react-router-dom";

const StudentPage = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.clear();
            navigate("/");
        } else {
            
            console.log("Logout canceled");
        }
    };
    


    return (
        <div className="student-page" style={{ padding: "20px", textAlign: "center" }}>
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
                        <Link to="/" onClick={handleLogout} className="nav-link">Logout</Link>
                    </li>
                </ul>
            </nav>

          

            {/* Content */}
            <Routes>
                <Route path="profile" element={<Profile />}  />                
            
            </Routes>

        </div>
    );
};

export default StudentPage;
