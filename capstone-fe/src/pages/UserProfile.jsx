// UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PersonalPostComponent from "../components/PostComponents/PersonalPostComponent";

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/userinfo/${username}`)
      .then((res) => setUserData(res.data))
      .catch((err) => console.log(err));
  }, [username]);

  if (!userData) return <div className="card">Loading...</div>;

  return (
    <div className="userprofilemaincontainer">
      <div className="card">
        <img
          src={userData.profile_picture || "default-img.png"}
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <p>{userData.username}</p>
        <div>
          <button className="btn">Friend</button>
          <button className="btn">Messages</button>
          <button className="btn">Add Friend</button>
          <button className="btn">Settings</button>
        </div>
        <p>{userData.name}</p>
        <p>{userData.bio}</p>
        <p>Friends with ...</p>
      </div>
      <hr />
      <div>
        <button className="btn" onClick={() => setActiveTab("posts")}>
          Posts
        </button>
        <button className="btn" onClick={() => setActiveTab("communities")}>
          Communities
        </button>
        <button className="btn" onClick={() => setActiveTab("tagged")}>
          Tagged
        </button>
      </div>
      <div>
        {activeTab === "posts" && <PersonalPostComponent username={username} />}
        {activeTab === "communities" && (
          <div className="card">Communities Content</div>
        )}
        {activeTab === "tagged" && <div className="card">Tagged Content</div>}
      </div>
    </div>
  );
}

export default UserProfile;
