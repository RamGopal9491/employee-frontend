import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export const BASEURL = "http://localhost:8083/";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${BASEURL}users/signin`, {
        email,
        password,
      });

      if (res.status === 200 && res.data) {
        // Save token and user info
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // Navigate based on backend role
        const userRole = res.data.user.role;

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
      setError("Error during sign-in. Check credentials or server.");
    }
  };

 return (
  <div className="auth-page">
    <div className="auth-banner">Employee Management System</div>

    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
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

        <button type="submit" className="auth-btn">
          Sign In
        </button>
      </form>

      {error && <p className="auth-error">{error}</p>}

      <p className="auth-footer">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  </div>
);

}
