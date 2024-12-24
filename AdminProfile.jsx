import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProfile.css";
import { Link, useNavigate } from "react-router-dom";

const AdminProfile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const username = localStorage.getItem("loggedInUser");
            const token = localStorage.getItem("token");

            if (!username || !token) {
                setError("User not logged in or token missing");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/profile/${username}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data) {
                    setUserDetails(response.data);
                    setFormData({
                        firstName: response.data.firstName || "",
                        lastName: response.data.lastName || "",
                        email: response.data.email || "",
                        dateOfBirth: response.data.dateOfBirth
                            ? new Date(response.data.dateOfBirth).toISOString().split("T")[0]
                            : "",
                    });
                } else {
                    setError("No user details found.");
                }
            } catch (err) {
                setError("Failed to fetch user details: " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const username = localStorage.getItem("loggedInUser");
        const token = localStorage.getItem("token");

        if (!username || !token) {
            setError("User not logged in or token missing");
            return;
        }

        try {
            setLoading(true);
            await axios.put(
                `http://localhost:8080/api/profile/${username}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserDetails(formData);
            setIsEditing(false);
            setError(""); // Clear any previous errors
        } catch (err) {
            setError("Failed to update profile: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.clear();
            navigate("/");
        }
    };

    if (loading) {
        return <p className="loading">Loading...</p>;
    }

    return (
        <div>
            <nav className="navbar">
                <ul className="nav-list">
                    <li><Link to="/admin/home" className="nav-link">Home</Link></li>
                    <li><Link to="/admin/students" className="nav-link">Students</Link></li>
                    <li><Link to="/admin/mentors" className="nav-link">Mentors</Link></li>
                    <li><Link to="/admin/timetable" className="nav-link">Timetable</Link></li>
                    <li><Link to="/admin/profile" className="nav-link">Profile</Link></li>
                    <li><Link to="/" onClick={handleLogout} className="nav-link">Logout</Link></li>
                </ul>
            </nav>
            <div className="profile-container">
                <h1 className="profile-heading">Admin Profile</h1>
                {error && <p className="error">{error}</p>}

                {userDetails ? (
                    isEditing ? (
                        <form className="profile-form">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="button-group">
                                <button
                                    type="button"
                                    className="save-btn"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="profile-row">
                                <span className="profile-label">First Name:</span>
                                <span className="profile-value">{userDetails.firstName}</span>
                            </div>
                            <div className="profile-row">
                                <span className="profile-label">Last Name:</span>
                                <span className="profile-value">{userDetails.lastName}</span>
                            </div>
                            <div className="profile-row">
                                <span className="profile-label">Email:</span>
                                <span className="profile-value">{userDetails.email}</span>
                            </div>
                            <div className="profile-row">
                                <span className="profile-label">DOB:</span>
                                <span className="profile-value">
                                    {userDetails.dateOfBirth
                                        ? new Date(userDetails.dateOfBirth).toLocaleDateString("en-US")
                                        : "N/A"}
                                </span>
                            </div>
                            <button
                                className="edit-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </button>
                        </div>
                    )
                ) : (
                    <p>No user details available.</p>
                )}
            </div>
        </div>
    );
};

export default AdminProfile;
