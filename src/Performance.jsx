import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Performance.css";

export default function Performance() {
  const BASEURL = "http://localhost:8083/";
  const API_URL = import.meta.env.VITE_API_URL

  const [employees, setEmployees] = useState([]);

  // ✅ Fetch employee performance data from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/api/performance`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching performance data:", err));
  }, []);

  const handleRatingChange = (id, newRating) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, rating: Number(newRating) } : emp
      )
    );
  };

  const handleFeedbackChange = (id, feedback) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, feedback } : emp
      )
    );
  };

  // ✅ Save performance to backend
  const handleSave = (emp) => {
    axios
      .put(`${API_URL}/api/performance/${emp.id}`, emp)
      .then(() => alert("Performance updated successfully!"))
      .catch((err) => console.error("Error saving performance:", err));
  };

  return (
    <div className="performance-container">
      <h2 className="performance-title">Employee Performance Tracking</h2>

      <table className="performance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Rating (1–5)</th>
            <th>Feedback</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.fullName}</td>
              <td>{emp.department}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={emp.rating || 0}
                  onChange={(e) => handleRatingChange(emp.id, e.target.value)}
                  className="rating-input"
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Enter feedback"
                  value={emp.feedback || ""}
                  onChange={(e) => handleFeedbackChange(emp.id, e.target.value)}
                  className="feedback-input"
                />
              </td>
              <td>
                <button
                  className="btn-save"
                  onClick={() => handleSave(emp)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
