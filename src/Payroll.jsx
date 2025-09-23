import React, { useEffect, useState } from "react";
import "./Payroll.css";

const BASEURL = "http://localhost:8083/api/payrolls";

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]);

  // Fetch payroll data from backend
  useEffect(() => {
    fetch(BASEURL)
      .then((res) => res.json())
      .then((data) => setPayrolls(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle salary change locally
  const handleSalaryChange = (id, newSalary) => {
    setPayrolls(
      payrolls.map((p) => (p.id === id ? { ...p, salary: Number(newSalary) } : p))
    );
  };

  // Update salary in backend
  const handleUpdateSalary = (p) => {
    fetch(`${BASEURL}/${p.id}/salary`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salary: p.salary }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setPayrolls(
          payrolls.map((pay) => (pay.id === updated.id ? updated : pay))
        );
        alert("Salary updated successfully!");
      })
      .catch((err) => console.error(err));
  };

  // Generate payslip
  const handleGeneratePayslip = (p) => {
    alert(
      `Payslip Generated:\n\nName: ${p.name}\nDepartment: ${p.department}\nSalary: $${p.salary}`
    );
  };

  return (
    <div className="payroll-container">
      <h2 className="payroll-title">Payroll Management</h2>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Salary ($)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.department}</td>
              <td>
                <input
                  type="number"
                  value={p.salary}
                  onChange={(e) => handleSalaryChange(p.id, e.target.value)}
                  className="salary-input"
                />
              </td>
              <td>
                <button
                  className="btn-payslip"
                  onClick={() => handleGeneratePayslip(p)}
                >
                  Generate Payslip
                </button>
                <button
                  className="btn-update"
                  onClick={() => handleUpdateSalary(p)}
                >
                  Update Salary
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
