import React, { useState } from "react";
import axios from "axios";
import ImgUploadComponent from "../ImageComponents/ImgUploadComponent";

const token = localStorage.getItem("token");
console.log("📢 Token Retrieved from Local Storage:", token);

const CreatePostComponent = ({
  endpoint = "http://localhost:5000/api/personal-post/post",
  onSuccess,
}) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgId, setImgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  const handleImageUpload = (uploadedImgId) => {
    console.log("Received imgId:", uploadedImgId);
    setImgId(uploadedImgId);
    setImageUrl("");
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImgId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: Please log in.");
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
      content,
      imgId: imgId ? imgId.toString() : null,
      imageUrl: imgId ? null : imageUrl,
    };

    console.log("📤 Sending Request Data:", JSON.stringify(postData, null, 2));
    console.log("✅ imgId Type:", typeof imgId);

    try {
      const response = await axios.post(endpoint, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Post created:", response.data);
      if (onSuccess) {
        onSuccess(response.data.newPost); // ✅ Update the post list
      }

      // Reset form and hide it
      setContent("");
      setImageUrl("");
      setImgId(null);
      setUploadMethod(null);
      setShowForm(false);
    } catch (err) {
      console.error("❌ Error creating post:", err);
      setError("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Toggle Button */}
      <button className="btn" onClick={() => setShowForm((prev) => !prev)}>
        {showForm ? "Close Post Form" : "Create New Post"}
      </button>

      {/* Form (Hidden until Button Clicked) */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>
            <h3>Create a New Post</h3>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your post..."
            />
          </label>

          {/* Buttons to select upload method */}
          <div>
            <button type="button" onClick={() => setUploadMethod("file")}>
              Upload a File
            </button>
            <button type="button" onClick={() => setUploadMethod("url")}>
              Use Image URL
            </button>
          </div>

          {/* Show file upload if "Upload a File" is selected */}
          {uploadMethod === "file" && (
            <label>
              <h3>Upload an Image</h3>
              <ImgUploadComponent onImageUpload={handleImageUpload} />
            </label>
          )}

          {/* Show image URL input if "Use Image URL" is selected */}
          {uploadMethod === "url" && (
            <label>
              <h3>Paste Image URL</h3>
              <input
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Paste image link..."
              />
              <br />
            </label>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Add New Post"}
          </button>
          {error && <p>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CreatePostComponent;
