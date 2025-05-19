import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SinglePostView from "../components/PostComponents/SinglePostViewComponent";
import LazyRenderWrapper from "../components/WhatAreThese/LazyRender";

function Home({ searchTerm }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/communitiespost/all`
      );
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setPosts(sortedPosts);
      console.log(posts)
      // window.location.reload(); // ✅ Correct
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getImageUrl = (post, size = "large") => {
    if (!post) return null;

    const basePath = post?.img_id
      ? `${import.meta.env.VITE_API_IMG_URL}${post.image_path}`
      : post?.img_url;

    if (!basePath) return null;

    if (size === "small") return basePath.replace(/(\.\w+)$/, "_small$1");
    if (size === "medium") return basePath.replace(/(\.\w+)$/, "_medium$1");
    return basePath;
  };

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
      );
      const username = response.data.username;
      navigate(`/${username}/${userId}`);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleCommunityClick = async (communityId) => {
    try {
      navigate(`/communities/${communityId}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [isDragging, setIsDragging] = useState(false);

const handleDragOver = (e) => {
  e.preventDefault();
  setIsDragging(true);
};

const handleDragLeave = (e) => {
  e.preventDefault();
  setIsDragging(false);
};

const handleDrop = async (e) => {
  e.preventDefault();
  setIsDragging(false);
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const formData = new FormData();
  formData.append("content", "Uploaded via drag-drop on grid");
  formData.append("image", file);

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/personal-post/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if needed
      },
    });
    console.log("✅ Uploaded:", res.data);
    fetchPosts(); // refresh grid
    window.location.reload(); // ✅ Correct

  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
};

  return (
    <div className="home-container">
      <div className="home-wrapper">
<div
  className={`masonry-gridhome ${isDragging ? "dragging" : ""}`}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
>  {[...posts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // newest first
    .filter((post) =>
      post.image_path.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // .slice(0, 20) // ⬅️ Only take the first 10
    .map((post) => {
      console.log("this is the", post);
      const imageLarge = getImageUrl(post, "large");
      return (
        <LazyRenderWrapper key={post.id}>
          <div
            className="masonry-item"
            onClick={() => {
              setSelectedPost(post);
              setSelectedImageUrl(imageLarge);
            }}
          >
            <img
              src={imageLarge}
              alt={post.caption || "Post"}
              loading="lazy"
            />
          </div>
        </LazyRenderWrapper>
      );
    })}
</div>

      </div>

      {selectedPost && (
        <SinglePostView
          post={selectedPost}
          imageUrl={selectedImageUrl}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}

export default Home;
