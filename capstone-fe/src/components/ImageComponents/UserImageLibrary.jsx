// UserImageLibrary.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserImageLibrary = ({ onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/images/user-images`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setImages(response.data);
      } catch (err) {
        setError(`Failed to fetch user images: ${err.response?.data?.error}`);
      }
    };
    fetchImages();
  }, [token]);

  return (
    <div className="card">
      <h2>Your Uploaded Images</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="grid">
        {images.length > 0 ? (
          images.map((image) => {
            const imageUrl = image.img_url
              ? image.img_url
              : `${import.meta.env.VITE_API_BASE_URL}${image.filepath}`;
            return (
              <img
                key={image.id}
                src={imageUrl}
                alt="Uploaded"
                style={{ maxWidth: "100px", margin: "5px" }}
                onClick={() =>
                  onSelectImage && onSelectImage(image.id, imageUrl)
                }
              />
            );
          })
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserImageLibrary;
