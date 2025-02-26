import React, { useEffect, useState } from "react";
import axios from "axios";

function MyProfile({ token }) {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("posts"); // 🔹 Tab State for Toggle

  useEffect(() => {
    axios(`${import.meta.env.VITE_API_BASE_URL}/:userid`, {  // 🔹 Fixed Axios request
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log(res.data);
        setUserData(res.data);
      })
      .catch((err) => console.log(err));
  }, [token]);

  if (!userData) return <p>Loading...</p>; 

  return (
    <div>
      {/* 🔹 Profile Section */}

      <span>
        <img src={userData.profileImg || "default-img.png"} alt="Profile" /> 
        <p>{userData.username}</p>
        <button>Friend</button>
        <button>Messages</button>
        <button>Add Friend</button>
        <button>Settings</button>
      </span>

      <p>{userData.name}</p>
      <p>{userData.bio}</p>

      {/* 🔹 Tags Section */}
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
        {activeTab === "posts" && <div>Posts</div>}
        {activeTab === "communities" && <div>Communities</div>}
        {/* {activeTab === "tagged" && <div>Tagged</div>} */}
      </div>
    </div>
  );
}

export default MyProfile;
