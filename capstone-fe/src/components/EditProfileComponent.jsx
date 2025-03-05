// EditProfileComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfileComponent() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    name: "",
    dob: "",
    visibility: "public",
    profile_picture: "",
    bio: "",
    location: "",
    status: "active",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserData(response.data);
      } catch (err) {
        setError("Failed to load profile information.");
      }
    }
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess(true);
      setError(null);
      alert("Profile updated successfully!");
      navigate("/myprofile");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  }

  return (
    <div className="card">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userData.username || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={userData.email || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={userData.name || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={userData.dob || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Visibility:
          <select
            name="visibility"
            value={userData.visibility || "public"}
            onChange={handleChange}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
        <label>
          Profile Picture URL:
          <input
            type="text"
            name="profile_picture"
            value={userData.profile_picture || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Bio:
          <textarea
            name="bio"
            value={userData.bio || ""}
            onChange={handleChange}
          ></textarea>
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={userData.location || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Status:
          <select
            name="status"
            value={userData.status || "active"}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <button type="submit" className="btn">
          Save Changes
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && (
        <p className="success-message">Profile updated successfully!</p>
      )}
    </div>
  );
}

export default EditProfileComponent;
