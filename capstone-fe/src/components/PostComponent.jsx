import React, { useState } from "react";
import axios from "axios";

const PostComponent = ({ endpoint, onSuccess }) => {
  const [content, setContent] = useState("");    
  const [imageUrl, setImageUrl] = useState("");  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData = { content, imageUrl };

    try {
      const response = await axios.post(
        endpoint,  
        postData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Post added:", response.data);
      onSuccess && onSuccess(response.data.data);

      setContent("");
      setImageUrl("");
    } catch (err) {
      console.error("Error sending data:", err);
      setError("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <label>
        <h3>Content</h3>
        <input 
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Write your post..."
          style={{ width: "100%", padding: "8px" }}
        />
      </label>
      <label>
        <h3>Image URL</h3>
        <input 
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Paste image link..."
          style={{ width: "100%", padding: "8px" }}
        />
      </label>
      <button type="submit" disabled={loading} style={{ marginTop: "10px", padding: "10px" }}>
        {loading ? "Posting..." : "Add New Post"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default PostComponent;
