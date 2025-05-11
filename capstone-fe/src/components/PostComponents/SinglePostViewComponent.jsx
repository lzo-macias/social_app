import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SinglePostView({ post, imageUrl, onClose }) {
  const [userPic, setUserPic] = useState(null);
  const [communityPic, setCommunityPic] = useState(null);
  const [username, setUsername] = useState(null);
  const [communityName, setCommunityName] = useState(null);
  const navigate = useNavigate();

  const handleBackgroundClick = (e) => {
    if (e.target.className === "single-post-overlay") {
      onClose();
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (post.user_id) {
          const userRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/users/${post.user_id}`
          );
          const fetchedUsername = userRes.data.username;
          setUsername(fetchedUsername);

          const userInfoRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/users/userinfo/${fetchedUsername}`
          );
          setUserPic(userInfoRes.data.profile_picture || null);
        }

        if (post.community_id) {
          const commRes = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/communities/${post.community_id}`
          );
          setCommunityPic(commRes.data.community_profile_picture || null);
          setCommunityName(commRes.data.name);
        }
      } catch (err) {
        console.error("Error fetching profile or community images:", err);
      }
    };

    fetchImages();
  }, [post.user_id, post.community_id]);

  const handleUserClick = () => {
    if (username && post.user_id) {
      navigate(`/${username}/${post.user_id}`);
    }
  };

  const handleCommunityClick = () => {
    if (post.community_id) {
      navigate(`/communities/${post.community_id}`);
    }
  };

  return (
    <div className="single-post-overlay" onClick={handleBackgroundClick}>
      <div className="single-post-content">
        <img src={imageUrl} alt={post.caption || "Post"} />
        <p>{post.content}</p>

        <div
          className="singleviewicons"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          {userPic && (
            <img
              src={`${import.meta.env.VITE_API_IMG_URL}${userPic}`}
              alt="User"
              title={username || "User Profile"}
              onClick={handleUserClick}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          )}
          {communityPic && (
            <img
              src={`${import.meta.env.VITE_API_IMG_URL}${communityPic}`}
              alt="Community"
              title={communityName || "Community Page"}
              onClick={handleCommunityClick}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePostView;
