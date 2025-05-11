import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostContainerComponent from "../components/CommunityComponents/CommunityPostContainerComponent";
import CreateCommunityPostComponent from "../components/CommunityComponents/CreateCommunityPostComponent";
import ChatBox from "../components/Chat-boxComponents/Chat-boxComponent";

function SingleCommunity() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [canDelete, setCanDelete] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isPostsView, setIsPostsView] = useState(true); // toggle state

  const showPosts = () => setIsPostsView(true);
  const showChat = () => setIsPostsView(false);

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/communities/${communityId}`
        );
        setCommunity(response.data);
        await checkMembership(response.data);
      } catch (err) {
        setError("Failed to load community details");
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityDetails();
  }, [communityId]);

  const checkMembership = async (communityData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
      if (communityData.created_by === userId) setCanDelete(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/communities/${communityId}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const members = res.data;
      const membershipRecord = members.find((m) => m.user_id === userId);
      if (membershipRecord) {
        setIsMember(true);
        if (membershipRecord.role === "admin") setCanDelete(true);
      }
    } catch (err) {
      console.error("Error checking membership:", err);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("You must be logged in to join a community.");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id;
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to join a community.");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/communities/addUserToCommunity/${communityId}/users/${userId}`,
        { role: "member" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoinMessage(response.data.message || "Joined successfully!");
      setIsMember(true);
      window.location.reload();
    } catch (err) {
      setJoinMessage(
        err.response?.data?.error || "Failed to join this community."
      );
    }
  };

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
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/communities/${communityId}/members/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("You have left the community.");
      setIsMember(false);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to leave the community.");
    }
  };

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
      alert(err.response?.data?.error || "Failed to delete this community.");
    }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card">{error}</div>;
  if (!community) return <div className="card">Community not found</div>;

  return (
    <div>
      <div className="singleCommunityHeaderLine">
        <h1>{community.name}</h1>
        <div className="singleCommunityHeaderLineIcons">
          {/* <button><img src="/icons/share.png" alt="Share Icon" /></button>
          <button><img src="/icons/post.png" alt="Post Icon" /></button>
          <button><img src="/icons/settings.png" alt="Settings Icon" /></button> */}
        </div>
      </div>

      <p>{community.description}</p>
      <div style={{ marginBottom: "20px" }}>
  {isMember&&<CreateCommunityPostComponent communityId={communityId} />}
  {/* {!isMember && (
    <button
      className="btn"
      style={{ marginLeft: "10px" }}
      onClick={handleJoinCommunity}
    >
      Join this community
    </button>
  )} */}
  {/* {isMember &&
    community.created_by !==
      JSON.parse(localStorage.getItem("user")).id && (
      <button
        className="btn"
        style={{ marginLeft: "10px" }}
        onClick={handleLeaveCommunity}
      >
        Leave this community
      </button>
    )} */}
</div>
      {/* {!isMember && (
        <button
          className="btn"
          style={{ marginLeft: "10px" }}
          onClick={handleJoinCommunity}
        >
          Join this community
        </button>
      )} */}

      {joinMessage && <p>{joinMessage}</p>}

      {/* {canDelete && (
        <div style={{ marginBottom: "20px" }}>
          <button className="btn" onClick={handleDeleteCommunity}>
            Delete This Community
          </button>
        </div>
      )} */}

      {/* Toggle Between Posts and Chat */}
      <div className="communityToggle">
        <h4 className={isPostsView ? "active" : ""} onClick={showPosts}>
          Posts
        </h4>
        <div className="divider" />
        <h4 className={!isPostsView ? "active" : ""} onClick={showChat}>
          Chat
        </h4>
      </div>

      {/* Conditionally Render Posts or Chat */}
      {isPostsView ? (
        <PostContainerComponent communityId={communityId} />
      ) : (
        <ChatBox communityId={community.id} />
      )}
    </div>
  );
}

export default SingleCommunity;

