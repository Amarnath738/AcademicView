import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import StudentPage from "./StudentPage";
import MentorPage from "./MentorPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/student" element={<StudentPage />} />
                <Route path="/mentor" element={<MentorPage />} />
            </Routes>
        </Router>
    );
};

export default App;
