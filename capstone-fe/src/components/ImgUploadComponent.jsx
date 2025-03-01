import React, { useState } from "react";
import axios from "axios";

const ImgUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

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
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadStatus("Upload successful!");
      setPreview(response.data.imageUrl); // Store the uploaded image URL
      onImageUpload(response.data.imageUrl); // Pass image URL back to parent component
    } catch (error) {
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
      )}
      <button onClick={handleUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ImgUploadComponent;
