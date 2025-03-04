import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatePostComponent from "./CreatePostComponent";
import FetchAllPostByUserIdComponent from "./FetchAllPostByUserIdComponent";
import axios from "axios";

const PersonalPostComponent = () => {
  const { userId } = useParams(); // Extract userId from the URL
  console.log("📢 Extracted userId from URL in Album:", userId);

  const [posts, setPosts] = useState([]);

  // ✅ Fetch posts initially
  useEffect(() => {
    if (!userId) {
      console.error("❌ userId is undefined or null");
      return;
    }
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/personal-post/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      } catch (err) {
        console.error("❌ Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [userId]);

  // ✅ Function to add a new post
  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="main-content">
      <CreatePostComponent onSuccess={handleNewPost} />
      <FetchAllPostByUserIdComponent userId={userId} posts={posts} setPosts={setPosts} />
    </div>
  );
};

export default PersonalPostComponent;
