import React from "react";
import './MentorPage.css';
import Profile from "./MentorProfile";
import { useNavigate } from "react-router-dom";
import {Link, Route,Routes } from "react-router-dom";

const MentorPage = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.clear();
            navigate("/");
        } else {
            // Do nothing if the user cancels
            console.log("Logout canceled");
        }
    };
    


    return (
        <div className="mentor-page" style={{padding:"20px",textAlign:"center"}}>
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
                        <Link to="/mentor-students" className="nav-link">Students</Link>
                    </li>
                    <li>
                        <Link to="/mentor/calendar" className="nav-link">Calendar</Link>
                    </li>
                    <li>
                        <Link to="/" onClick={handleLogout} className="nav-link">Logout</Link>
                    </li>
                </ul>
            </nav>
            
            {/* Main Content */}

           
            <Routes>
                <Route path="profile" element={<Profile />} />
            </Routes>

        </div>
    );
};

export default MentorPage;
