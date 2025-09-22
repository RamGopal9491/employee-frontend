import React from "react";
import "./Payslips.css";

export default function Payslips() {
  const payslips = [
    { id: 1, month: "July 2025", amount: "$3000" },
    { id: 2, month: "August 2025", amount: "$3100" },
  ];

  return (
    <div className="payslips-container">
      <h2 className="payslips-title">My Payslips</h2>
      <table className="payslips-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Amount</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {payslips.map((slip) => (
            <tr key={slip.id}>
              <td>{slip.month}</td>
              <td>{slip.amount}</td>
              <td>
                <button className="download-btn">Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
