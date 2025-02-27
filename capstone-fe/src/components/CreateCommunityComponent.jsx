// CreateCommunity.jsx
import React, { useState } from "react";
import axios from "axios";

function CreateCommunity() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description) {
      setError("Both community name and description are required.");
      return;
    }

    setLoading(true);

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/communities`, {
        name,
        description,
      })
      .then((response) => {
        setLoading(false);
        console.log("Community created:", response.data);
        alert("COMMUNITY CREATED")
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

export default CreateCommunity;
