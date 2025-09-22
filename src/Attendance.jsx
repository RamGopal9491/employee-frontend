import React from "react";
import "./Attendance.css";
import { useAttendance } from "./AttendanceContext";  // ✅ use shared context

export default function Attendance() {
  const { attendance, markAttendance } = useAttendance();

  const employees = [
    { id: 1, name: "John Doe", department: "IT" },
    { id: 2, name: "Jane Smith", department: "HR" },
    { id: 3, name: "Michael Lee", department: "Finance" },
  ];

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Today's Attendance</h2>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.department}</td>
              <td>
                {attendance[emp.id] ? (
                  <span
                    className={
                      attendance[emp.id].status === "Present"
                        ? "status-present"
                        : "status-absent"
                    }
                  >
                    {attendance[emp.id].status} <br />
                    <small>{attendance[emp.id].dateTime}</small>
                  </span>
                ) : (
                  <>
                    <button
                      className="btn-present"
                      onClick={() => markAttendance(emp.id, emp.name, "Present")}
                    >
                      Present
                    </button>
                    <button
                      className="btn-absent"
                      onClick={() => markAttendance(emp.id, emp.name, "Absent")}
                    >
                      Absent
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
