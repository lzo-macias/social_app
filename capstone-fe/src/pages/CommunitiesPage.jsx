import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CreateCommunity from "../components/CommunityComponents/CreateCommunityComponent";

function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/communities`)
      .then((response) => {
        setCommunities(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching communities:", err);
        setError("Failed to load communities.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card">{error}</div>;

  const filteredCommunities = communities.filter((community) => {
    const combinedText = (community.name + community.description).toLowerCase();
    return combinedText.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>Communities</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CreateCommunity />
      <div className="grid1">
        {filteredCommunities.map((community) => {
          console.log("📣 Rendering community:", community);
          return (
            <div className="sidebar-communities-list1" key={community.id}>
              <Link to={`/communities/${community.id}`} className="circle-profile-container">
                {community.community_profile_picture && (
                 <img
                    src={community.community_profile_picture}
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

export default CommunitiesPage;
