import React, { useState } from "react";
import "./Salary.css";

export default function Salary() {
  const [search, setSearch] = useState("");
  const [salaryList] = useState([
    {
      sno: 1,
      empName: "John Doe",   
      salary: 600,
      allowance: 50,
      deduction: 30,
      total: 620,
      payDate: "2024-09-15",
    },
    {
      sno: 2,
      empName: "Michael Lee", 
      salary: 700,
      allowance: 60,
      deduction: 40,
      total: 720,
      payDate: "2024-09-20",
    },
  ]);

  // ✅ filter safely
  const filteredSalaries = salaryList.filter((s) =>
    s.empName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="salary-container">
      <h2 className="salary-title">Salary History</h2>

      <div className="salary-topbar">
        <input
          type="text"
          placeholder="Search By Emp Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="salary-search"
        />
      </div>

      <table className="salary-table">
        <thead>
          <tr>
            <th>SNO</th>
            <th>EMP NAME</th>
            <th>SALARY</th>
            <th>ALLOWANCE</th>
            <th>DEDUCTION</th>
            <th>TOTAL</th>
            <th>PAY DATE</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalaries.length > 0 ? (
            filteredSalaries.map((s) => (
              <tr key={s.sno}>
                <td>{s.sno}</td>
                <td>{s.empName}</td>
                <td>{s.salary}</td>
                <td>{s.allowance}</td>
                <td>{s.deduction}</td>
                <td>{s.total}</td>
                <td>{new Date(s.payDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
