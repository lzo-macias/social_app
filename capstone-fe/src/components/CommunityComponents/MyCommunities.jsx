import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function MyCommunities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userid, setUserid] = useState(null);
  // First: load user ID from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserid(parsedUser.id);
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, []);

  // Second: fetch communities once userid is available
  useEffect(() => {
    if (!userid) return; // wait for userid to be set

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/users/${userid}/communities`)
      .then((response) => {
        setCommunities(response.data.communities);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching communities:", err);
        setError("Failed to load communities.");
        setLoading(false);
      });
  }, [userid]);
  console.log(userid)

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card">{error}</div>;

  const filteredCommunities = communities;

  return (
    <div>
      <div className="grid1">
        {filteredCommunities.map((community) => {
          console.log("📣 Rendering community:", community);
          return (
            <div className="sidebar-communities-list1" key={community.id}>
              <Link to={`/communities/${community.id}`} className="circle-profile-container">
                {community.community_profile_picture && (
                 <img
                 src={`${import.meta.env.VITE_API_IMG_URL}${community.community_profile_picture}`}
                 alt={`${community.name} profile`}
                    className="circle-profile-img"
                />
                )}
              <p className="circle-profile-name">{community.name}</p>
              </Link>
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyCommunities;