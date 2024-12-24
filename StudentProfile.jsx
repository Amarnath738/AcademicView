import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const email = localStorage.getItem("loggedInUser");
      const token = localStorage.getItem("token");

      if (!email || !token) {
        setError("User not logged in or token missing");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/profile/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserDetails(response.data);
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          email: response.data.email || "",
          dateOfBirth: response.data.dateOfBirth || "",
        });
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("Access forbidden. Please login again.");
        } else {
          setError("Failed to fetch user details");
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const email = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:8080/api/profile/${email}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserDetails(formData);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-heading">Student Profile</h1>
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
            <button
              type="button"
              className="save-btn"
              onClick={handleSave}
            >
              Save
            </button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <div>
            <div className="profile-row">
              <span className="profile-label" style={{color: "blue"}}>First Name:</span>
              <span className="profile-value" style={{color: "blue"}}>{userDetails.firstName}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label" style={{color: "blue"}}>Last Name:</span>
              <span className="profile-value" style={{color: "blue"}}>{userDetails.lastName}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label" style={{color: "blue"}}>Email:</span>
              <span className="profile-value" style={{color: "blue"}}>{userDetails.email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label" style={{color: "blue"}}>DOB:</span>
              <span className="profile-value" style={{color: "blue"}}> {new Date(userDetails.dateOfBirth).toLocaleDateString('en-US', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}</span>
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
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StudentProfile;
