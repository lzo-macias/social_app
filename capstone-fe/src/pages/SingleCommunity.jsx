import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PostContainerComponent from "../components/PostContainerComponent";

const SingleCommunity = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!community) return <div>Community not found</div>;

  return (
    <div>
      <Link to="/communities">
        <button>Browse All Communities</button>
      </Link>
      <h1>{community.name}</h1>
      <p>{community.description}</p>
      <h2>Community Posts:</h2>
      <PostContainerComponent communityId={communityId} />
    </div>
  );
};

export default SingleCommunity;
