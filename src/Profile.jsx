import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    department: "IT",
    photo: null,
  });

  const [showPopup, setShowPopup] = useState(false); // for popup state

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true); // show success popup
  };

  const handleOk = () => {
    setShowPopup(false);
    navigate("/employee-dashboard"); // redirect to employee dashboard
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, photo: URL.createObjectURL(file) });
    }
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
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
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
