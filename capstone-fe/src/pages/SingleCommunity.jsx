// SingleCommunity.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import PostContainerComponent from "../components/PostContainerComponent";
import CreateCommunityPostComponent from "../components/PostComponents/CreateCommunityPostComponent";

function SingleCommunity() {
  const { communityId } = useParams();
  const navigate = useNavigate();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [canDelete, setCanDelete] = useState(false);
  const [isMember, setIsMember] = useState(false); // track if user is a member

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        // Fetch the single community object
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/communities/${communityId}`
        );
        setCommunity(response.data);
        await checkMembership(response.data);
      } catch (err) {
        console.error("Error fetching community details:", err);
        setError("Failed to load community details");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityDetails();
  }, [communityId]);

  // Check if current user is the creator or has admin role (for delete) and if they are a member (for leave)
  const checkMembership = async (communityData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;

      // Check if user is the creator
      if (communityData.created_by === userId) {
        setCanDelete(true);
      }

      // Fetch all membership records for the community
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/communities/${communityId}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const members = res.data; // Expect an array of membership records

      // Check if current user is in the members list
      const membershipRecord = members.find((m) => m.user_id === userId);
      if (membershipRecord) {
        setIsMember(true);
        // Also, if the role is "admin", allow deletion as well.
        if (membershipRecord.role === "admin") {
          setCanDelete(true);
        }
      }
    } catch (err) {
      console.error("Error checking membership:", err);
    }
  };

  // Handler for joining the community (existing functionality)
  const handleJoinCommunity = async () => {
    try {
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to join a community.");
        return;
      }
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/communities/addUserToCommunity/${communityId}/users/${userId}`,
        { role: "member" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinMessage(response.data.message || "Joined successfully!");
      console.log("✅ Community joined:", response.data);
      setIsMember(true);
      // Refresh the page after successful join
      window.location.reload();
    } catch (err) {
      console.error("❌ Error joining community:", err);
      setJoinMessage(
        err.response?.data?.error || "Failed to join this community."
      );
    }
  };

  // Handler for leaving the community
  const handleLeaveCommunity = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("You must be logged in to leave a community.");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to leave a community.");
        return;
      }
      // Send DELETE request to leave the community
      await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/communities/${communityId}/members/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("You have left the community.");
      setIsMember(false);
      // Refresh the page after leaving
      window.location.reload();
    } catch (err) {
      console.error("Error leaving community:", err);
      alert(err.response?.data?.error || "Failed to leave the community.");
    }
  };

  // Handler for deleting the community (only for creator/admin)
  const handleDeleteCommunity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You're not logged in.");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/communities/${communityId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Community deleted successfully!");
      navigate("/communities");
    } catch (err) {
      console.error("Error deleting community:", err);
      alert(err.response?.data?.error || "Failed to delete this community.");
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

      {/* Buttons for post creation, joining/leaving, and deleting */}
      <div style={{ marginBottom: "20px" }}>
        <CreateCommunityPostComponent communityId={communityId} />
        {!isMember && (
          <button style={{ marginLeft: "10px" }} onClick={handleJoinCommunity}>
            Join this community
          </button>
        )}
        {isMember &&
          community.created_by !==
            JSON.parse(localStorage.getItem("user")).id && (
            <button
              style={{ marginLeft: "10px" }}
              onClick={handleLeaveCommunity}
            >
              Leave this community
            </button>
          )}
      </div>

      {/* Show success/error message from joining */}
      {joinMessage && <p>{joinMessage}</p>}

      {/* If the user is the creator or an admin, show Delete button */}
      {canDelete && (
        <div style={{ marginBottom: "20px" }}>
          <button onClick={handleDeleteCommunity}>Delete This Community</button>
        </div>
      )}

      <h2>Community Posts:</h2>
      <PostContainerComponent communityId={communityId} />
    </div>
  );
}

export default SingleCommunity;
