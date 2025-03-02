import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import axios from "axios";

function UserProfile() {
  const { username } = useParams();  // Retrieve the 'username' from the URL
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("posts"); // 🔹 Tab State for Toggle

  useEffect(() => {
    console.log(username); // Debugging: Log the username
    // Send a request to get the user data based on the username
    axios(`${import.meta.env.VITE_API_BASE_URL}/users/userinfo/${username}`)
      .then((res) => {
        console.log(res.data); // Debugging: Log the response
        setUserData(res.data);
      })
      .catch((err) => console.log(err));
  }, [username]); // Ensure this re-runs when the username changes

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="userprofilemaincontainer">
      {/* 🔹 Profile Section */}
      <span>
        <img
          src={userData.profile_picture || "default-img.png"}
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <p>{userData.username}</p>
        <button>Friend</button>
        <button>Messages</button>
        <button>Add Friend</button>
        <button>Settings</button>
      </span>
      <p>{userData.name}</p>
      <p>{userData.bio}</p>

      {/* 🔹 Tags Section (if any) */}
      {/* Uncomment this section if you have tags for the user */}
      {/* <div>
        {userData.tags?.map((tag, index) => (
          <div key={index}>#{tag}</div>
        ))}
      </div> */}

      <p>Friends with ...</p>
      <hr className="my-line" />

      {/* 🔹 Toggle Buttons */}
      <div>
        <button onClick={() => setActiveTab("posts")}>Posts</button>
        <button onClick={() => setActiveTab("communities")}>Communities</button>
        <button onClick={() => setActiveTab("tagged")}>Tagged</button>
      </div>

      {/* 🔹 Dynamic Content Based on Tab */}
      <div>
        {activeTab === "posts" && <div>Posts Content</div>}
        {activeTab === "communities" && <div>Communities Content</div>}
        {activeTab === "tagged" && <div>Tagged Content</div>}
      </div>
    </div>
  );
}

export default UserProfile;
