// PersonalPostComponent.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatePostComponent from "./CreatePostComponent";
import FetchAllPostByUserIdComponent from "./FetchAllPostByUserIdComponent";
import axios from "axios";

const PersonalPostComponent = ({ username }) => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!userId) {
      console.error("userId is undefined or null");
      return;
    }
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/personal-post/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [userId, username]);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div className="grid posts-container">
      <CreatePostComponent onSuccess={handleNewPost} />
      <FetchAllPostByUserIdComponent
        userId={userId}
        posts={posts}
        setPosts={setPosts}
      />
    </div>
  );
};

export default PersonalPostComponent;
