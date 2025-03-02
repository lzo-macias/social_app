import React, { useState, useEffect } from "react";
import axios from "axios";
import CommunitySectionComponent from "../components/CommunitySectionComponent";
import PostContainerComponent from "../components/PostContainerComponent";

function Home() {
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/communitiesPost/all`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    console.log(posts)
  }, []);

  return (
    <div className="homecontainer">
      {/* {selectedCommunityId ? (
        <PostContainerComponent
          communityId={selectedCommunityId}
          onBack={() => setSelectedCommunityId(null)}
        />
      ) : (
        <CommunitySectionComponent onSelectCommunity={setSelectedCommunityId} />
      )} */}
      <label>
        Search:
        <input type="text"  />
      </label>
      <div className="home-post-container">
  {posts
    .filter((post) => {
      console.log(post); // Log each post for debugging
      return post.content.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .map((post) => (
      <div key={post.id} className="home-post">
        <p>{post.content}</p>
      </div>
    ))
  }
</div>
    </div>
  );
}

export default Home;
