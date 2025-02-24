const express = require("express");
const router = express.Router();

const {
  fetchCommunities,
  fetchCommunityById,
  fetchCommunityMembers,
  fetchPostsByCommunity,
  createCommunity,
  addUserToCommunity,
} = require("../db/community");

const { createPost } = require("../db/post");

// Get all communities
router.get("/", async (req, res) => {
  try {
    const communities = await fetchCommunities(); // Fetch all communities
    res.status(200).json(communities); // Send the list of communities as a response
  } catch (err) {
    console.error("Error fetching communities:", err.message);
    res.status(500).json({ error: "Failed to fetch communities" });
  }
});

// Get community details by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const community = await fetchCommunityById(id);
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    res.json(community);
  } catch (err) {
    console.error("Error fetching community by ID:", err.message);
    res.status(500).json({ error: "Failed to fetch community" });
  }
});

// Get community members
router.get("/:id/members", async (req, res) => {
  const { id } = req.params;
  try {
    const members = await fetchCommunityMembers(id);
    res.json(members);
  } catch (err) {
    console.error("Error fetching community members:", err.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Get posts in a community
router.get("/:id/posts", async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await fetchPostsByCommunity(id);
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts by community:", err.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Create a new community
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ error: "Community name and description are required" });
  }

  try {
    console.log("Request Body:", req.body); // Log the incoming request body
    const newCommunity = await createCommunity({ name, description });

    console.log("Newly Created Community:", newCommunity); // Log the newly created community
    res.status(201).json(newCommunity);
  } catch (err) {
    console.error("Error creating community:", err.message); // Log the error
    res
      .status(500)
      .json({ error: "Failed to create community", details: err.message });
  }
});

// Add a user to a community
router.post("/:communityId/members", async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Assuming a function like addUserToCommunity exists
    const addedMember = await addUserToCommunity(communityId, userId);

    if (addedMember) {
      res.status(201).json({ message: "User added to community", addedMember });
    } else {
      res.status(404).json({ error: "Community or user not found" });
    }
  } catch (err) {
    console.error("Error adding user to community:", err.message);
    res
      .status(500)
      .json({ error: "Failed to add user to community", details: err.message });
  }
});

// Create a new post in a community
router.post("/:communityId/posts", async (req, res) => {
  const { communityId } = req.params;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: "User ID and content are required" });
  }

  try {
    const newPost = await createPost({ userId, communityId, content });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err.message);
    res
      .status(500)
      .json({ error: "Failed to create post", details: err.message });
  }
});

module.exports = router;
