import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirect after success

function CreateCommunityComponent() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch user ID from localStorage (or from a global state management like Redux)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id); // Assuming user object has an "id" field
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
        {
          name,
          description,
          admin_id: userId, // Send admin_id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Sending token for authentication
          },
        }
      )
      .then((response) => {
        setLoading(false);
        console.log("Community created:", response.data);
        alert("COMMUNITY CREATED");
      })
      .catch((error) => {
        setLoading(false);
        setError("Error creating community. Please try again later.");
        console.error("Error creating community:", error);
      });
  };

  return (
    <div>
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
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Community"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default CreateCommunityComponent;
