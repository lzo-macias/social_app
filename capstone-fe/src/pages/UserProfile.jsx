import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PersonalPostComponent from "../components/PostComponents/PersonalPostComponent";

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  // currentUsername = JSON.parse(localStorage.getItem("user").user);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/userinfo/${username}`)
      .then((res) => setUserData(res.data))
      .catch((err) => console.log(err));
  }, [username]);

  if (!userData) return <div className="card">Loading...</div>;

  const handleMessageClick = () => {
    navigate(`/direct-message/${currentUser?.username}/${username}`);
  };

  return (
    <div className="user-profile-main-container">
      <div className="card user-profile-card">
        <img
          src={
            userData.profile_picture ||
            "https://banner2.cleanpng.com/20240226/xqj/transparent-cartoon-girl-beautiful-young-woman-long-hair-curly-beautiful-young-woman-with-long-brown-1710863504600.webp"
          }
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <div className="user-profile-info">
          <p>@{userData.username}</p>
          <p>{userData.bio}</p>
        </div>

        {username !== currentUser?.username && (
          <button className="btn" onClick={handleMessageClick}>
            Message
          </button>
        ) 
        // : (
        //   <button className="btn">Edit</button>
        // )
        }
      </div>

      <div className="communityToggle">
        <h4
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </h4>
        <div className="divider" />
        <h4
          className={activeTab === "communities" ? "active" : ""}
          onClick={() => setActiveTab("communities")}
        >
          Communities
        </h4>
        <div className="divider" />
        <h4
          className={activeTab === "tag" ? "active" : ""}
          onClick={() => setActiveTab("tag")}
        >
          Tags
        </h4>
      </div>

      <br />
      <div>
        {activeTab === "posts" && <PersonalPostComponent username={username} />}
        {activeTab === "communities" && (
          <div className="card">Communities Content</div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
