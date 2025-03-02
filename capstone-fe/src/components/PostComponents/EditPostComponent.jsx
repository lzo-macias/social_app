import React, { useState } from "react";
import axios from "axios";
import ImgUploadComponent from "../ImageComponents/ImgUploadComponent";
import UserImageLibrary from "../ImageComponents/UserImageLibrary"; // ✅ Import User Image Library

const EditPostComponent = ({
  postId,
  initialContent,
  initialImgId,
  initialImgUrl,
  onUpdateSuccess,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const [imageUrl, setImageUrl] = useState(initialImgUrl || "");
  const [imgId, setImgId] = useState(initialImgId);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (uploadedImgId) => {
    setImgId(uploadedImgId);
    setImageUrl(""); // Reset URL if a file is uploaded
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setImgId(null); // Reset uploaded file when using an image URL
  };

  const handleSelectImage = (selectedImgId, selectedImageUrl) => {
    setImgId(selectedImgId);
    setImageUrl(selectedImageUrl);
    setShowLibrary(false); // Close library after selection
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
      setError("An image is required.");
      setLoading(false);
      return;
    }

    const postData = {
      content,
      imgId: imgId ? imgId.toString() : null,
      imageUrl: imgId ? null : imageUrl,
    };

    try {
      await axios.put(
        `http://localhost:5000/api/personal-post/post/${postId}`,
        postData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Post updated successfully!");
      onUpdateSuccess(content, imgId || imageUrl);
    } catch (err) {
      console.error("❌ Error updating post:", err);
      setError("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="4"
        cols="50"
      />

      {/* ✅ Image Selection Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button type="button" onClick={() => setUploadMethod("file")}>
          Upload New
        </button>
        <button type="button" onClick={() => setUploadMethod("url")}>
          Use Image URL
        </button>
        <button type="button" onClick={() => setShowLibrary(true)}>
          Choose from Library
        </button>
      </div>

      {uploadMethod === "file" && (
        <ImgUploadComponent onImageUpload={handleImageUpload} />
      )}
      {uploadMethod === "url" && (
        <input type="text" value={imageUrl} onChange={handleImageUrlChange} />
      )}
      {showLibrary && <UserImageLibrary onSelectImage={handleSelectImage} />}

      <button type="submit">{loading ? "Updating..." : "Save Changes"}</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default EditPostComponent;
