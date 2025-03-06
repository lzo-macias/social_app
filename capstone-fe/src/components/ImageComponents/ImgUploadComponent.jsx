// ImgUploadComponent.jsx
import React, { useState } from "react";
import axios from "axios";

const ImgUploadComponent = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const token = localStorage.getItem("token");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/images/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUploadStatus("Upload successful!");
      if (response.data.imgId) {
        onImageUpload(response.data.imgId);
      } else {
        setUploadStatus("Image upload failed. No imgId returned.");
      }
    } catch (error) {
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div className="card">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
      )}
      <button className="btn" onClick={handleUpload}>
        Upload
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImgUploadComponent;
