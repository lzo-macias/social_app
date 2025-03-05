// CreateCommunityPostComponent.jsx
import React, { useState } from "react";
import axios from "axios";
import ImgUploadComponent from "../ImageComponents/ImgUploadComponent";

function CreateCommunityPostComponent({ communityId }) {
  const endpoint = `${
    import.meta.env.VITE_API_BASE_URL
  }/communitiespost/${communityId}/posts`;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgId, setImgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleImageUpload = (uploadedImgId) => {
    setImgId(uploadedImgId);
    setImageUrl("");
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImgId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      setLoading(false);
      return;
    }
    if (!imgId && !imageUrl) {
      setError(
        "An image is required. Please upload a file or provide an image URL."
      );
      setLoading(false);
      return;
    }
    const postData = {
      title,
      content,
      imgId: imgId ? imgId.toString() : null,
      imageUrl: imageUrl ? imageUrl.trim() : null,
    };
    try {
      const response = await axios.post(endpoint, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Community Post created:", response.data);
      // Full page reload approach:
      window.location.reload();
    } catch (err) {
      console.error("❌ Error creating community post:", err);
      setError("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <button className="btn" onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? "Close Community Post Form" : "Create New Community Post"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <h3>Create a New Community Post</h3>
          <label>
            Post Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Post Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>
          <div>
            <button
              type="button"
              className="btn"
              onClick={() => setUploadMethod("file")}
            >
              Upload a File
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setUploadMethod("url")}
            >
              Use Image URL
            </button>
          </div>
          {uploadMethod === "file" && (
            <div>
              <h4>Upload an Image</h4>
              <ImgUploadComponent onImageUpload={handleImageUpload} />
            </div>
          )}
          {uploadMethod === "url" && (
            <label>
              <h4>Paste Image URL</h4>
              <input
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/image.jpg"
              />
            </label>
          )}
          <button type="submit" disabled={loading} className="btn">
            {loading ? "Posting..." : "Add Community Post"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
  );
}

export default CreateCommunityPostComponent;
