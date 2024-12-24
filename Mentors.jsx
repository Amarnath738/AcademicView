import React, { useEffect, useState } from "react";
import axios from "axios";
import "./mentor.css";
import { Link } from "react-router-dom";

const Mentors = () => {
    const [mentors, setMentors] = useState([]);
    const [error, setError] = useState("");
    const [editingMentorId, setEditingMentorId] = useState(null);
    const [editedMentor, setEditedMentor] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedMentorId, setSelectedMentorId] = useState(null);
    const [unassignedStudents, setUnassignedStudents] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignedStudents, setAssignedStudents] = useState([]);

    // Handle Cancel when editing
    const handleCancel = () => {
        setEditingMentorId(null);
        setEditedMentor({});
    };

    const handleAssignClick = async (mentorId) => {
        // Show the assign student modal
        setSelectedMentorId(mentorId);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/admin/unassigned-students", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnassignedStudents(response.data); // Set unassigned students
            setShowAssignModal(true);
        } catch (err) {
            alert("Failed to fetch unassigned students: " + (err.response?.data?.message || err.message));
        }
    };

    const handleAssignStudent = async (studentId) => {
        // Assign selected student to the selected mentor
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:8080/api/admin/assign-student",  // Ensure this is the correct endpoint
                { mentorId: selectedMentorId, studentId },  // Send both IDs in the request body
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("Student assigned successfully.");
            setShowAssignModal(false);
        } catch (err) {
            alert("Failed to assign student: " + (err.response?.data?.message || err.message));
        }
    };

    // Fetch assigned students for the selected mentor
    const fetchAssignedStudents = async (mentorId) => {
        try {
            const token = localStorage.getItem("token");
            console.log('Fetching assigned students for mentor ID:', mentorId);
            const response = await axios.get(`http://localhost:8080/api/admin/assigned-student/${mentorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignedStudents(response.data);  // Set the assigned students
        } catch (err) {
            alert("Failed to fetch assigned students: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (mentorId) => {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            await axios.delete(`http://localhost:8080/api/admin/mentors/${mentorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMentors((prevMentors) => prevMentors.filter((mentor) => mentor.id !== mentorId));
            alert("Mentor deleted successfully");
        } catch (err) {
            alert("Failed to delete mentor: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchMentors = async () => {
            const token = localStorage.getItem("token");
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/api/admin/mentors", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const approvedMentors = response.data.filter((mentor) => mentor.approved === true);
                setMentors(approvedMentors);
            } catch (err) {
                setError("Failed to fetch mentors: " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    const handleEditClick = (mentor) => {
        setEditingMentorId(mentor.id);
        setEditedMentor({ ...mentor });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedMentor((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSaveClick = async () => {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            await axios.put(
                `http://localhost:8080/api/admin/users/${editingMentorId}`,
                editedMentor,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMentors((prevMentors) =>
                prevMentors.map((mentor) =>
                    mentor.id === editingMentorId ? editedMentor : mentor
                )
            );
            setEditingMentorId(null);
            alert("Mentor updated successfully");
        } catch (err) {
            alert("Failed to update mentor: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mentors-page">
            <nav className="navbar">
                <ul className="nav-list">
                    <li><Link to="/admin/home" className="nav-link">Home</Link></li>
                    <li><Link to="/admin/students" className="nav-link">Students</Link></li>
                    <li><Link to="/admin/mentors" className="nav-link">Mentors</Link></li>
                    <li><Link to="/admin/timetable" className="nav-link">Timetable</Link></li>
                    <li><Link to="/admin/profile" className="nav-link">Profile</Link></li>
                </ul>
            </nav>
            <h1 className="page-title">Mentors List</h1>
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Experience</th>
                        <th>Degree</th>
                        <th>Skill</th>
                        <th>Date of Birth</th>
                        <th>Actions</th>
                        <th>Assigned Students</th>
                    </tr>
                </thead>
                <tbody>
                    {mentors.map((mentor) => (
                        <tr key={mentor.id}>
                            {editingMentorId === mentor.id ? (
                                <>
                                    <td><input type="text" name="firstName" value={editedMentor.firstName} onChange={handleInputChange} /></td>
                                    <td><input type="text" name="lastName" value={editedMentor.lastName} onChange={handleInputChange} /></td>
                                    <td><input type="email" name="email" value={editedMentor.email} onChange={handleInputChange} /></td>
                                    <td><input type="text" name="experience" value={editedMentor.experience} onChange={handleInputChange} /></td>
                                    <td><input type="text" name="degree" value={editedMentor.degree} onChange={handleInputChange} /></td>
                                    <td><input type="text" name="skill" value={editedMentor.skill} onChange={handleInputChange} /></td>
                                    <td><input type="date" name="dateOfBirth" value={editedMentor.dateOfBirth} onChange={handleInputChange} /></td>
                                    <td>
                                        <button onClick={handleSaveClick}>Save</button>
                                        <button onClick={handleCancel}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{mentor.firstName}</td>
                                    <td>{mentor.lastName}</td>
                                    <td>{mentor.email}</td>
                                    <td>{mentor.experience}</td>
                                    <td>{mentor.degree}</td>
                                    <td>{mentor.skill}</td>
                                    <td>{mentor.dateOfBirth ? new Date(mentor.dateOfBirth).toLocaleDateString() : ''}</td>
                                    <td>
                                        <button onClick={() => handleAssignClick(mentor.id)}>Assign Student</button>
                                        <button onClick={() => handleEditClick(mentor)}>Edit</button>
                                        <button onClick={() => handleDelete(mentor.id)}>Delete</button>
                                    </td>
                                    <td>
                                        <button onClick={() => fetchAssignedStudents(mentor.id)}>
                                            Show Assigned Students
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {assignedStudents.length > 0 && (
                <div>
                    <h3>Assigned Students</h3>
                    <ul>
                        {assignedStudents.map(student => (
                            <li key={student.id}>
                                {student.firstName} {student.lastName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {showAssignModal && (
                <div className="modal">
                    <h3>Select a Student to Assign</h3>
                    <ul>
                        {unassignedStudents.map(student => (
                            <li key={student.id}>
                                <button onClick={() => handleAssignStudent(student.id)}>
                                    Assign {student.firstName} {student.lastName}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowAssignModal(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Mentors;
