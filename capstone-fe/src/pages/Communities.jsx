import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCommunities } from "../../../capstone-be/server/db";
const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch communities from API
    const fetchCommunities = async () => {
      try {
        const response = await fetch("/api/communities"); // Adjust API endpoint as needed
        if (!response.ok) throw new Error("Failed to fetch communities");
        const data = await response.json();
        
      } catch (error) {
        console.error(error);
      }
    };
    fetchCommunities();setCommunities(data);
  }, []);

  const handleJoin = async (id) => {
    try {
      const response = await fetch(`/api/communities/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to join community");
      alert("Joined successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to join community");
    }
  };

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Communities</h1>
      <input
        type="text"
        placeholder="Search communities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 border rounded w-full mb-4"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommunities.map((community) => (
          <div key={community.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{community.name}</h2>
            <p className="text-gray-600">{community.topic}</p>
            <div className="flex justify-between items-center mt-2">
              <Link
                to={`/community/${community.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
              <button
                onClick={() => handleJoin(community.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Communities;


// 4. Connecting the Frontend (React)
// In your Community.jsx, you need to:

// Create a form for users to upload images.
// Send the image to the Express backend using fetch or Axios.
// Display the uploaded images in the community.
// Basic Upload Form in Community.jsx

import { useState } from "react";
import axios from "axios";

const Community = ({ communityId, userId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("community_id", communityId);
    formData.append("user_id", userId);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImages([...images, response.data]); // Add new image to list
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div>
      <h2>Community</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <div>
        {images.map((img) => (
          <img key={img.id} src={`http://localhost:5000${img.image_url}`} alt="Uploaded" width="200" />
        ))}
      </div>
    </div>
  );
};

export default Community;