import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SinglePostView from "../components/PostComponents/SinglePostViewComponent";
import LazyRenderWrapper from "../components/WhatAreThese/LazyRender";

function Home({ searchTerm }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/communitiespost/all`
      );
      console.log('axios fetch',response)
      setPosts(response.data);
      console.log('posts: ', posts)
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getImageUrl = (post, size = "large") => {
    if (!post) return null;

    const basePath = post?.img_id
      ? `${import.meta.env.VITE_API_IMG_URL}${post.image_path}`
      : post?.img_url;

    if (!basePath) return null;

    if (size === "small") return basePath.replace(/(\.\w+)$/, "_small$1");
    if (size === "medium") return basePath.replace(/(\.\w+)$/, "_medium$1");
    return basePath;
  };

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
      );
      const username = response.data.username;
      navigate(`/${username}/${userId}`);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleCommunityClick = async (communityId) => {
    try {
      navigate(`/communities/${communityId}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="home-container">
      {/* <div className="home-search-container">
        <label>
          Search:
          <input
            className="home-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div> */}

      {/* <h2 className="explore">Explore All Posts</h2>
      <div className="home-post-container">
        {posts
          .filter((post) =>
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((post) => {
            const imageSmall = getImageUrl(post, "small");
            const imageMedium = getImageUrl(post, "medium");
            const imageLarge = getImageUrl(post, "large");

            return (
              <div key={post.id} className="card home-post">
                <img
                  src={imageLarge}
                  srcSet={`${imageSmall} 480w, ${imageMedium} 800w, ${imageLarge} 1200w`}
                  sizes="(max-width: 600px) 480px, (max-width: 1024px) 800px, 1200px"
                  loading="lazy"
                  alt={post.caption || "Post"}
                  className="w-full h-auto object-cover rounded-md"
                />
                <p>{post.content}</p>
                <button
                  className="btn"
                  onClick={() => handleUserClick(post.user_id)}
                >
                  Check out the user
                </button>
                {post.community_id !== null && (
                  <button
                    className="btn"
                    onClick={() => handleCommunityClick(post.community_id)}
                  >
                    Check out community
                  </button>
                )}
              </div>
            );
          })}
      </div> */}

      <div className="home-wrapper">
        {/* <div className="search-bar">
          <label>
            <input
              className="home-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img className="searchicon" src="/icons/magnifier.png" alt="" />
          </label>
        </div> */}

        <div className="masonry-grid">
        {posts
  .filter((post) =>
    post.image_path.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map((post) => {
    console.log("this is the", post)
    const imageLarge = getImageUrl(post, "large");
    return (
      <LazyRenderWrapper key={post.id}>
        <div
          className="masonry-item"
          onClick={() => {
            setSelectedPost(post);
            setSelectedImageUrl(imageLarge);
          }}
        >
          <img src={imageLarge} alt={post.caption || "Post"} loading="lazy" />
        </div>
      </LazyRenderWrapper>
    );
  })}
        </div>
      </div>

      {selectedPost && (
        <SinglePostView
          post={selectedPost}
          imageUrl={selectedImageUrl}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}

export default Home;
