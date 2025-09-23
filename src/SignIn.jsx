import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export const BASEURL = "http://localhost:8083/";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // default role
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role");
      return;
    }

    try {
      const res = await axios.post(`${BASEURL}users/signin`, {
        email,
        password,
        role,
      });

      if (res.status === 200 && res.data) {
        // Store token and user info
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Navigate based on role
        const userRole = res.data.user.role || role; // fallback to selected role
        if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else if (userRole === "employee") {
          navigate("/employee-dashboard");
        } else {
          setError("Unknown role. Cannot navigate.");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("SignIn Error:", err);
      setError("Error during sign in. Check credentials or server.");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Sign In</h2>
      <form className="auth-form" onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role Selection */}
        <select
          className="auth-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>

        <button type="submit" className="auth-btn">
          Sign In
        </button>
      </form>

      {error && <p className="auth-error">{error}</p>}

      <p className="auth-footer">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
