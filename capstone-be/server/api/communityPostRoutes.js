const express = require("express");
const router = express.Router();
const {
  fetchPostsByCommunity,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
} = require("../db/communityPost"); // Importing the necessary CRUD functions
const isLoggedIn = require("../middleware/isLoggedIn"); // Middleware for authentication

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
router.post("/posts", isLoggedIn, async (req, res, next) => {
  try {
    const { communityId } = req.body; // changed from req.params to req.body
    const { title, content } = req.body;
    const userId = req.user.id; // Assuming `isLoggedIn` sets `req.user`

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

// Route for updating a post in a specific community
router.put(
  "/communities/:communityId/posts/:postId",
  isLoggedIn,
  async (req, res, next) => {
    const { postId, communityId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // Assume the user ID is set by the isLoggedIn middleware

    try {
      const updatedPost = await updateCommunityPost(postId, content, userId);
      res.json(updatedPost);
    } catch (err) {
      next(err); // Pass the error to the error handler middleware
    }
  }
);

// Delete a post in a community
router.delete("/posts/:postId", isLoggedIn, async (req, res, next) => {
  const { postId } = req.params;

  try {
    const deletedPost = await deleteCommunityPost(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully", deletedPost });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
