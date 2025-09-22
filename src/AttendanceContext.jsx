import React, { createContext, useState, useContext } from "react";

export const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState({});

  const markAttendance = (id, name, status) => {
    const dateTime = new Date().toLocaleString();
    setAttendance((prev) => ({
      ...prev,
      [id]: { name, status, dateTime },
    }));
  };

  return (
    <AttendanceContext.Provider value={{ attendance, markAttendance }}>
      {children}
    </AttendanceContext.Provider>
  );
};


