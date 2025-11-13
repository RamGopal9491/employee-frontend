import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const storedProfile = JSON.parse(localStorage.getItem("user"));
  const [profile, setProfile] = useState(storedProfile);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Convert image file → Base64
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result }); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8083/users/${profile.empid}`,
        profile
      );
      localStorage.setItem("user", JSON.stringify(response.data)); // update local storage
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleOk = () => {
    setShowPopup(false);
    navigate("/employee-dashboard");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Update Profile</h2>

      <div className="profile-photo-section">
        <img
          src={profile.photo || "https://via.placeholder.com/120"}
          alt="Profile"
          className="profile-photo"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="file-input"
        />
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={profile.fullname}
          onChange={(e) => setProfile({ ...profile, fullname: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />

        <label>Department</label>
        <input
          type="text"
          value={profile.department}
          onChange={(e) =>
            setProfile({ ...profile, department: e.target.value })
          }
        />

        <button type="submit">Save Changes</button>
      </form>

      {/* ✅ Success Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>✅ Profile Updated Successfully!</h3>
            <button onClick={handleOk}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
