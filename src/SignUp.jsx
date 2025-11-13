import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

// Base API URL
export const BASEURL = "http://localhost:8083/";

export default function SignUp() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ role is fixed, no dropdown
  const role = "employee";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const newUser = { fullname: fullName, email, password, role };
      const response = await axios.post(`${BASEURL}users/signup`, newUser);

      if (response.status === 200 || response.status === 201) {
        alert("Account created successfully!");
        navigate("/signin");
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);

      if (error.response?.status === 409) {
        alert("User already exists! Please sign in.");
      } else {
        alert("Failed to create account. Please check your server.");
      }
    }
  };

  return (
    <div className="auth-container">
          <div className="auth-banner">Employee Management System</div>

      <h2 className="auth-title">Sign Up</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          className="auth-input"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* ✅ Removed dropdown */}

        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="auth-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn">Sign Up</button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
}

