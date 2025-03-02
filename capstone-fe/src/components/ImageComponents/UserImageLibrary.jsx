import React, { useState, useEffect } from "react";
import axios from "axios";

const UserImageLibrary = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log("🚀 Fetching user images...");

        const response = await axios.get(
          "http://localhost:5000/api/images/user-images",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
            },
          }
        );

        console.log("✅ Fetched Images:", response.data);
        setImages(response.data);
      } catch (err) {
        console.error("❌ Error fetching user images:", err);
        setError(`Failed to fetch user images: ${err.response?.data?.error}`);
      }
    };

    fetchImages();
  }, [token]);

  return (
    <div>
      <h2>Your Uploaded Images</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {images.length > 0 ? (
          images.map((image) => {
            const imageUrl = image.img_url
              ? image.img_url
              : `http://localhost:5000${image.filepath}`;

            return (
              <img
                key={image.id}
                src={imageUrl} // ✅ Now supports both local files and URLs
                alt="Uploaded"
                style={{ maxWidth: "100px", margin: "5px" }}
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
