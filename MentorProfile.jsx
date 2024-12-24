import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Mentorprofile.css';

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const email = localStorage.getItem('loggedInUser');
            const token = localStorage.getItem('token');

            if (!email || !token) {
                setError('User not logged in or token missing');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/profile/${email}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserDetails(response.data);
                setFormData({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    dateOfBirth: response.data.dateOfBirth || '',
                });
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to fetch user details');
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        const email = localStorage.getItem('loggedInUser');
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(
                `http://localhost:8080/api/profile/${email}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUserDetails(response.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-heading">Mentor Profile</h1>
            {error && <p className="error">{error}</p>}
            {userDetails ? (
                isEditing ? (
                    <div className='profile-edit'>
                    <form className="profile-form">
                    <h2>Edit Profile</h2>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="button" className="save-btn" onClick={handleSave}>
                            Save
                        </button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                    
                    </div>
                ) : (
                    <div className="profile-view">
                        <div className="profile-row">
                            <span className="profile-label">Firstname:</span>
                            <span className="profile-value">{userDetails.firstName}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Lastname:</span>
                            <span className="profile-value">{userDetails.lastName}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">Email:</span>
                            <span className="profile-value">{userDetails.email}</span>
                        </div>
                        <div className="profile-row">
                            <span className="profile-label">DOB:</span>
                            <span className="profile-value">
                                {new Date(userDetails.dateOfBirth).toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                        <button className="edit-btn" onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                    </div>
                )
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
