import React, { useEffect, useState } from "react";
import { useNavigate, Link} from "react-router-dom";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [dmThreads, setDmThreads] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const username = user?.username;
  const userId = user?.id;

  useEffect(() => {
    if (!username || !userId || !token) return;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Fetch communities the user is in
    fetch(`${import.meta.env.VITE_API_BASE_URL}/communities/user/${username}`, {
      method: "GET",
      headers,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCommunities(data);
        } else {
          console.warn("Expected array but got:", data);
          setCommunities([]);
        }
      })
      .catch((err) => console.error("❌ Error fetching communities:", err));

    // Fetch DM threads
    fetch(`${import.meta.env.VITE_API_BASE_URL}/messages/direct-threads/${userId}`, {
      method: "GET",
      headers,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDmThreads(data);
          console.log(data);
        } else {
          console.warn("Expected array but got:", data);
          setDmThreads([]);
        }
      })
      .catch((err) => console.error("❌ Error fetching DMs:", err));
  }, [username, userId, token]);

  return (
    <>
      {/* <Link to="/" className="header-logo no-underline">Shenanigram</Link> */}
  
      <div className="flex-gap-4-p-4-overflow-x-auto">
        {/* DM Threads First */}
        {dmThreads.map((user) => (
          <div 
            key={user.id}
            className="flex-shrink-0-cursor-pointer-text-center"
            onClick={() => navigate(`/${user.username}/${user.id}`)}
          >
            <img className = "headerimg"
              src={`${import.meta.env.VITE_API_IMG_URL}${user.profile_picture}`}
              alt={user.username}
              // className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
            <p className="text-xs mt-1">{user.username}</p>
          </div>
        ))}
  
        {/* Communities */}
        {communities.map((community) => (
          <div 
            key={community.id}
            className="flex-shrink-0-cursor-pointer-text-center"
            onClick={() => navigate(`/communities/${community.id}`)}
          >
            <img className = "headerimg"
              src={`${import.meta.env.VITE_API_IMG_URL}${community.community_profile_picture}`}
              alt={community.name}
              // className="w-16 h-16 rounded-full object-cover border border-gray-300"
            />
            <p className="text-xs mt-1">{community.name}</p>
          </div>
        ))}
      </div>
    </>
  );  
};

export default HeaderComponent;
