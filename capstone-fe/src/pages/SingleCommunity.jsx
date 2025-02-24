import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function SingleCommunity() {
  const { id } = useParams(); // Use this to get the community ID from the URL
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch community details
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/communities/${id}`)
      .then((response) => {
        setCommunity(response.data);
      })
      .catch((error) =>
        console.error("Error fetching community details:", error)
      );

    // Fetch community members
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/communities/${id}/members`)
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) =>
        console.error("Error fetching community members:", error)
      );

    // Fetch posts in the community
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/communities/${id}/posts`)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, [id]);

  if (!community) return <div>Loading...</div>;

  return (
    <div>
      <h1>{community.name}</h1>
      <p>{community.description}</p>

      <h2>Community Members</h2>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.username} - {member.role}
          </li>
        ))}
      </ul>

      <h2>Posts</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.content}</li>
          ))}
        </ul>
      ) : (
        <p>No posts yet</p>
      )}
    </div>
  );
}

export default SingleCommunity;
