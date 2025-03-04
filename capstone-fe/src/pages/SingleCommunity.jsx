// SingleCommunity.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PostContainerComponent from "../components/PostContainerComponent";
import CreateCommunityPostComponent from "../components/PostComponents/CreateCommunityPostComponent";

function SingleCommunity() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // We need to store messages from joining the community
  const [joinMessage, setJoinMessage] = useState("");

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        // 1) Fetch the single community object
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/communities/${communityId}`
        );
        setCommunity(response.data);
      } catch (err) {
        console.error("Error fetching community details:", err);
        setError("Failed to load community details");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [communityId]);

  // 2) Click handler to “join” the community
  const handleJoinCommunity = async () => {
    try {
      // Retrieve user from localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("You must be logged in to join a community.");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
      if (!userId) {
        alert("Could not find user ID. Please re-log.");
        return;
      }

      // Also retrieve the token
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to join a community.");
        return;
      }

      // 3) Make a POST request to add the user to the community
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/addUserToCommunity/${communityId}/users/${userId}`,
        { role: "member" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 4) If successful, show success message
      setJoinMessage(response.data.message || "Joined successfully!");
      console.log("✅ Community joined:", response.data);
    } catch (err) {
      // 5) If error, show error message
      console.error("❌ Error joining community:", err);
      setJoinMessage(
        err.response?.data?.error || "Failed to join this community."
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!community) return <div>Community not found</div>;

  return (
    <div className="main-content">
      <Link to="/communities">
        <button>Browse All Communities</button>
      </Link>

      <h1>{community.name}</h1>
      <p>{community.description}</p>

      {/* “Create New Community Post” + “Join this community” */}
      <div style={{ marginBottom: "20px" }}>
        <CreateCommunityPostComponent
          communityId={communityId}
          onSuccess={() => {
            // Optionally refresh the post list if you want
          }}
        />

        {/* The new “Join this community” button */}
        <button style={{ marginLeft: "10px" }} onClick={handleJoinCommunity}>
          Join this community
        </button>
      </div>

      {/* Show success/error from joining */}
      {joinMessage && <p>{joinMessage}</p>}

      <h2>Community Posts:</h2>
      <PostContainerComponent communityId={communityId} />
    </div>
  );
}

export default SingleCommunity;
