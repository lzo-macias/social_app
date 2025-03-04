import React, { useState } from "react";
import axios from "axios";
import ImgUploadComponent from "../ImageComponents/ImgUploadComponent";

function CreateCommunityPostComponent({ communityId, onSuccess }) {
  // The route we’ll call: /communities/:communityId/posts
  // We'll build this dynamically from your .env base URL
  const endpoint = `${
    import.meta.env.VITE_API_BASE_URL
  }/communities/${communityId}/posts`;

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgId, setImgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Handle receiving an imgId from the ImgUploadComponent
  const handleImageUpload = (uploadedImgId) => {
    console.log("Received imgId:", uploadedImgId);
    setImgId(uploadedImgId);
    setImageUrl("");
  };

  // If user chooses “Use Image URL” instead of file
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImgId(null); // clear any previously uploaded file
  };

  // Submit the post
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

    // Validate form: require title, content, and at least some image
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

    // Build request body
    const postData = {
      title,
      content,
      imgId: imgId ? imgId.toString() : null,
      imageUrl: imgId ? null : imageUrl,
    };

    console.log(
      "📤 Sending Community Post Data:",
      JSON.stringify(postData, null, 2)
    );

    try {
      const response = await axios.post(endpoint, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Community Post created:", response.data);
      if (onSuccess) {
        // If you pass an onSuccess callback, e.g. to refresh the post list
        onSuccess(response.data.newPost || response.data);
      }

      // Reset form
      setTitle("");
      setContent("");
      setImageUrl("");
      setImgId(null);
      setUploadMethod(null);
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error creating community post:", err);
      setError("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      {/* Toggle Button to show/hide the form */}
      <button onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? "Close Community Post Form" : "Create New Community Post"}
      </button>

      {/* The form is hidden until you click */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <h3>Create a New Community Post</h3>

          {/* Title input */}
          <label>
            Post Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          {/* Content input */}
          <label>
            Post Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>

          {/* Buttons to select upload method (file or URL) */}
          <div>
            <button type="button" onClick={() => setUploadMethod("file")}>
              Upload a File
            </button>
            <button type="button" onClick={() => setUploadMethod("url")}>
              Use Image URL
            </button>
          </div>

          {/* If “Upload a File” is selected, show our ImgUploadComponent */}
          {uploadMethod === "file" && (
            <div>
              <h4>Upload an Image</h4>
              <ImgUploadComponent onImageUpload={handleImageUpload} />
            </div>
          )}

          {/* If “Use Image URL” is selected, show the URL input */}
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

          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Add Community Post"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default CreateCommunityPostComponent;
