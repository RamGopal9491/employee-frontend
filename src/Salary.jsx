import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Salary.css";

const BASEURL = "http://localhost:8083/api/payrolls";

export default function Salary() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [salaryList, setSalaryList] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user")); // contains empid

  const fetchSalary = async () => {
    if (!user?.empid) return;
    try {
      const res = await axios.get(`${API_URL}/api/payrolls/emp/id/${user.empid}`);
      setSalaryList(res.data);
    } catch (err) {
      console.error("Error fetching salary:", err);
      alert("Failed to load salary details");
    }
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  const filteredSalaries = salaryList.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="salary-container">
      <h2 className="salary-title">My Salary Details</h2>

      <div className="salary-topbar">
        <input
          type="text"
          placeholder="Search By Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="salary-search"
        />
      </div>

      <table className="salary-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary (₹)</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalaries.length > 0 ? (
            filteredSalaries.map((s, index) => (
              <tr key={s.id}>
                <td>{index + 1}</td>
                <td>{s.empid}</td>
                <td>{s.name}</td>
                <td>{s.department}</td>
                <td>{s.salary.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No salary records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
