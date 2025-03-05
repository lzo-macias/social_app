// CreateCommunityComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateCommunityComponent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) {
      setError("Both community name and description are required.");
      return;
    }
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }
    setLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL}/communities`,
        { name, description, createdBy: userId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => {
        alert("COMMUNITY CREATED");
        navigate("/");
      })
      .catch((error) => {
        setError("Error creating community. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="card">
      <h1>Create a New Community</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Community Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Creating..." : "Create Community"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreateCommunityComponent;
