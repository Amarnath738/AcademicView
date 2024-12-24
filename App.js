import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './login';
import StudentPage from './StudentPage';
import MentorPage from './MentorPage';
import ForgotPassword from './ForgotPassword';
import SuperAdmin from './Super-Admin Dashboard';
import AdminProfile from './AdminProfile';
import Students from './Students';
import Mentors from "./Mentors";
import './AdminProfile.css';
import './SuperAdmin.css';
import './StudentPage.css';
import './MentorPage.css';
import './login.css';
import './ForgotPassword.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';


export const fetchUserCounts = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/user-counts`);
  return response.data;
};
function App() {
  const [role, setRole] = useState(localStorage.getItem('role')); // Initialize from localStorage

  // Update the role state whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />
        {role === 'student' && <Route path="/student/*" element={<StudentPage />} />}
        {role === 'mentor' && <Route path="/mentor/*" element={<MentorPage />} />}
        {role === 'admin' && <Route path="/admin/*" element={<SuperAdmin />} />}
        
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/courses" element={<h1>Courses</h1>} />
        
        <Route path="/logout" element={<Navigate to="/" />} /> {/* Redirect to login page */}
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/admin/home" element={<SuperAdmin />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/students" element={<Students />} />
                <Route path="/admin/mentors" element={<Mentors />} />
      </Routes>
    </Router>
  );
}

export default App;
