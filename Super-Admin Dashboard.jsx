import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./SuperAdmin.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const SuperAdminDashboard = () => {
    const [counts, setCounts] = useState({ students: 0, mentors: 0 });
    const [loading, setLoading] = useState(true);
    const [pendingMentors, setPendingMentors] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);  // Added state for students
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const fetchCounts = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/counts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (isMounted) {
                    setCounts(response.data);
                }
            } catch (err) {
                console.error("Error fetching counts:", err);
                if (isMounted) {
                    setError("Failed to fetch dashboard data.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const fetchPendingMentors = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/pending-users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (isMounted) {
                    setPendingMentors(response.data.filter((user) => user.role === "mentor"));
                    setPendingStudents(response.data.filter((user) => user.role === "student"));  // Filter pending students
                }
            } catch (err) {
                console.error("Error fetching pending mentors:", err);
                if (isMounted) {
                    setError("Failed to fetch pending users.");
                }
            }
        };

        fetchCounts();
        fetchPendingMentors();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleApprove = async (userId, role) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(`${API_BASE_URL}/admin/approve/${userId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(response.data);
            if (role === "mentor") {
                setPendingMentors(pendingMentors.filter((mentor) => mentor.id !== userId));
            } else if (role === "student") {
                setPendingStudents(pendingStudents.filter((student) => student.id !== userId));
            }
        } catch (err) {
            console.error("Error approving user:", err);
            alert(err.response?.data || "Failed to approve user.");
        }
    };

    const handleDelete = async (userId, role) => {
        const token = localStorage.getItem("token");
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/admin/delete/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert(response.data);
                if (role === "mentor") {
                    setPendingMentors(pendingMentors.filter((mentor) => mentor.id !== userId));
                } else if (role === "student") {
                    setPendingStudents(pendingStudents.filter((student) => student.id !== userId));
                }
            } catch (err) {
                console.error("Error deleting user:", err);
                alert(err.response?.data || "Failed to delete user.");
            }
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            navigate("/");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="superadmin-dashboard">
            <nav className="navbar">
                <ul className="nav-list">
                    <li><Link to="/admin/home" className="nav-link">Home</Link></li>
                    <li><Link to="/admin/students" className="nav-link">Students</Link></li>
                    <li><Link to="/admin/mentors" className="nav-link">Mentors</Link></li>
                    <li><Link to="/admin/timetable" className="nav-link">Timetable</Link></li>
                    <li><Link to="/admin/profile" className="nav-link">Profile</Link></li>
                    <li><Link to="/admin/pending-approvals" className="nav-link">Pending Approvals</Link></li>
                    <li><Link to="/" onClick={handleLogout} className="nav-link">Logout</Link></li>
                </ul>
            </nav>

            {/* Home Section */}
            {location.pathname === "/admin/home" && (
                <div className="count-display-container">
                    <div className="count-boxes">
                        <div className="stat-box">
                            <h3>Students</h3>
                            <p>{counts.students}</p>
                        </div>
                        <div className="stat-box">
                            <h3>Mentors</h3>
                            <p>{counts.mentors}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Approvals Section */}
            {location.pathname === "/admin/pending-approvals" && (
                <div className="pending-approvals">
                    <h1 className="page-title">Pending Mentor Approvals</h1>
                    {error && <p className="error">{error}</p>}
                    {/* Pending Mentors */}
                    {pendingMentors.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Experience</th>
                                    <th>Degree</th>
                                    <th>Skill</th>
                                    <th>Department</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingMentors.map((mentor) => (
                                    <tr key={mentor.id}>
                                        <td>{mentor.email}</td>
                                        <td>{mentor.role}</td>
                                        <td>{mentor.experience}</td>
                                        <td>{mentor.degree}</td>
                                        <td>{mentor.skill}</td>
                                        <td>{mentor.department}</td>
                                        <td>
                                            <button onClick={() => handleApprove(mentor.id, "mentor")}>Approve</button>
                                            <button onClick={() => handleDelete(mentor.id, "mentor")}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No pending mentor approvals found.</p>
                    )}

                   
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
