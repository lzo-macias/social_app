const express = require("express");
const router = express.Router();
const {
  fetchPostsByCommunity,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
} = require("../db/communityPost"); // Importing CRUD functions

// Fetch posts by community ID
router.get("/communities/:communityId/posts", async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const posts = await fetchPostsByCommunity(communityId);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// Create a new post in a community
router.post("/communities/:communityId/posts", async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const { title, content, userId } = req.body; // userId must now be passed in the request body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const newPost = await createCommunityPost({
      communityId,
      userId,
      title,
      content,
    });

    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

// Update a post in a specific community
router.put(
  "/communities/:communityId/posts/:postId",
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { content, userId } = req.body; // userId must now be passed in the request body

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const updatedPost = await updateCommunityPost(postId, content, userId);
      res.json(updatedPost);
    } catch (err) {
      next(err);
    }
  }
);

// Delete a post in a community
router.delete(
  "/communities/:communityId/posts/:postId",
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body; // userId must now be passed in the request body

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const deletedPost = await deleteCommunityPost(postId);

      if (!deletedPost) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json({ message: "Post deleted successfully", deletedPost });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
