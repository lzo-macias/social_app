import React, { useState, useEffect } from "react";
import axios from "axios";
import CommunitySectionComponent from "../components/CommunitySectionComponent";
import PostContainerComponent from "../components/PostContainerComponent";
import CreatePostComponent from "../components/PostComponents/CreatePostComponent";

function Home() {
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/communitiesPost/all`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    console.log(posts);
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
        <input type="text" />
      </label>
<<<<<<< HEAD
      <div className="home-post-container">
  {posts
    .filter((post) => {
      console.log(post); // Log each post for debugging
      return post.content.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .map((post) => (
      <div key={post.id} className="home-post">
        <p>{post.content}</p>
=======
      <div>
        {posts
          .filter((post) =>
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((post) => (
            <div key={post.id} className="post">
              <p>{post.content}</p>
            </div>
          ))}
>>>>>>> 8cb43d3b2f9e6306f4c561eb7b31e32a3c57f0cb
      </div>
    ))
  }
</div>
    </div>
  );
}

export default Home;
