import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Student.css";


const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem("token");
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/api/admin/students", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStudents(response.data);
            } catch (err) {
                setError("Failed to fetch students: " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="students-page">
            <nav className="navbar">
                <ul className="nav-list">
                    <li><Link to="/admin/home" className="nav-link">Home</Link></li>
                    <li><Link to="/admin/students" className="nav-link">Students</Link></li>
                    <li><Link to="/admin/mentors" className="nav-link">Mentors</Link></li>
                    <li><Link to="/admin/timetable" className="nav-link">Timetable</Link></li>
                    <li><Link to="/admin/profile" className="nav-link">Profile</Link></li>
                </ul>
            </nav>
            <h1 className="page-title">Students List</h1>
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error">{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Interested In</th>
                        <th>Pursuing</th>
                        <th>Degree</th>
                        <th>Date of Birth</th>
                        <th>Mentor</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{student.email}</td>
                            <td>{student.interested}</td>
                            <td>{student.pursuing}</td>
                            <td>{student.degree}</td>
                            <td>{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                            <td>{student.mentor ? `${student.mentor.firstName} ${student.mentor.lastName}` : 'No Mentor'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Students;
