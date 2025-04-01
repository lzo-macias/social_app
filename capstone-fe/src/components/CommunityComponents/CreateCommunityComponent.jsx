import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateCommunityComponent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      setError("Both community name and description are required.");
      return;
    }
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/communities`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("COMMUNITY CREATED");
      window.location.reload();
      navigate("/");
    } catch (err) {
      console.error("Error creating community:", err);
      setError("Error creating community. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <button
        className="btn create-community-form-toggle-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "Create a New Community"}
      </button>

      {showForm && (
        <div className="form-container">
          <h3>Create a New Community</h3>
          <form className="create-new-community-form" onSubmit={handleSubmit}>
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
            <label>
              Profile Picture:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <br />
            <button type="submit" disabled={loading} className="btn">
              {loading ? "Creating..." : "Create Community"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default CreateCommunityComponent;
