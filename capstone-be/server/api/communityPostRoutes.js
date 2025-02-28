const express = require("express");
const router = express.Router();
const {
  fetchPostsByCommunity,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
} = require("../db/communityPost"); // Importing CRUD functions

const isLoggedIn = require("../middleware/isLoggedIn");
const { pool } = require("../db/index"); // ✅ Import pool for database queries

// Fetch posts by community ID
router.get("/:communityId/posts", async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const posts = await fetchPostsByCommunity(communityId);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// Create a new post in a community (Requires Authentication)
router.post("/:communityId/posts", isLoggedIn, async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id; // ✅ Get user ID from token instead of request body

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // ✅ Check if the community exists before posting
    const communityCheck = await pool.query(
      "SELECT id FROM communities WHERE id = $1",
      [communityId]
    );

    if (communityCheck.rows.length === 0) {
      return res.status(404).json({ error: "Community not found" });
    }

    const newPost = await createCommunityPost({
      communityId,
      userId,
      title,
      content,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    next(err);
  }
});

// ✅ Update a post in a specific community (Requires Authentication)
router.put(
  "/:communityId/posts/:postId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const userId = req.user.id; // ✅ Extract user ID from token

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      // ✅ Update the post only if the user is the owner
      const updatedPost = await updateCommunityPost(postId, content, userId);

      res.status(200).json(updatedPost);
    } catch (err) {
      console.error("❌ Error updating post:", err.message);
      res.status(403).json({ error: err.message }); // ✅ Return error as JSON response
    }
  }
);

// Delete a post in a community
router.delete(
  "/:communityId/posts/:postId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id; // ✅ Extract user ID from token

      // ✅ Check if the post exists and get its owner
      const postCheck = await pool.query(
        "SELECT user_id, community_id FROM posts WHERE id = $1",
        [postId]
      );

      if (postCheck.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      const postOwnerId = postCheck.rows[0].user_id;
      const communityId = postCheck.rows[0].community_id;

      // ✅ Check if the user is an admin of the community
      const adminCheck = await pool.query(
        "SELECT * FROM community_members WHERE community_id = $1 AND user_id = $2 AND role = 'admin'",
        [communityId, userId]
      );

      // ✅ Allow deletion only if user is the post owner or an admin
      if (postOwnerId !== userId && adminCheck.rows.length === 0) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this post" });
      }

      const deletedPost = await deleteCommunityPost(postId);

      res
        .status(200)
        .json({ message: "Post deleted successfully", deletedPost });
    } catch (err) {
      console.error("❌ Error deleting post:", err);
      next(err);
    }
  }
);

module.exports = router;
