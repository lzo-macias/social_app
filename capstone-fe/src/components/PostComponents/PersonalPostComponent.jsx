import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreatePostComponent from "../CreatePostComponent";
import FetchAllPostByUserIdComponent from "./FetchAllPostByUserIdComponent";
import SinglePostView from "./SinglePostViewComponent";
import axios from "axios";

const PersonalPostComponent = ({ username }) => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [myUserId, setMyUserid] = useState();
  const [selectedPost, setSelectedPost] = useState(null); // ✅ modal state
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setMyUserid(parsedUser.id);
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, []);

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

  // ✅ Get image URL logic reused from Home
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

  return (
    <div className="personal-post-container2">
      {myUserId === userId && <CreatePostComponent onSuccess={handleNewPost} />}
      <div className="masonry-grid">
        {posts.map((post) => {
          const imageLarge = getImageUrl(post, "large");
          return (
            <div
              key={post.id}
              className="masonry-item"
              onClick={() => {
                setSelectedPost(post);
                setSelectedImageUrl(imageLarge);
              }}
            >
              <img src={imageLarge} alt={post.caption || "Post"} />
            </div>
          );
        })}
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
};

export default PersonalPostComponent;
