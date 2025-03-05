const express = require("express");
const router = express.Router();
const {
  fetchCommentsByPostCommunity,
  createCommunityPostComment,
  updateCommunityPostComment,
  deleteCommunityPostComment,
} = require("../db/communityPostComments");
const isLoggedIn = require("../middleware/isLoggedIn");

// POST: Create a comment on a community post
router.post(
  "/:communityId/:postId/comment",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { postId, communityId } = req.params;
      // FIX: Use req.user.id to get the current user's ID
      const createdbyId = req.user.id;
      const { comment } = req.body;

      if (!comment) {
        return res.status(400).json({ error: "Comment is required" });
      }

      const newComment = await createCommunityPostComment({
        postId,
        communityId,
        createdbyId,
        comment,
      });

      // Return the created comment (with proper created_by and created_at)
      res.status(201).json(newComment);
    } catch (err) {
      console.error("Error creating comment:", err);
      next(err);
    }
  }
);

// GET: Fetch all comments for a specific post
router.get("/:communityId/:postId/comments", isLoggedIn, async (req, res) => {
  try {
    const { postId } = req.params;
    const communityPostComments = await fetchCommentsByPostCommunity(postId);
    res.status(200).json(communityPostComments);
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// PUT: Update a comment for a specific post
router.put(
  "/:communityId/:postId/:commentId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { comment } = req.body;
      const result = await updateCommunityPostComment(commentId, comment);
      res.status(200).json(result);
    } catch (err) {
      console.error("Error updating comment:", err);
      next(err);
    }
  }
);

// DELETE: Delete a comment for a specific post
router.delete(
  "/:communityId/:postId/:commentId",
  isLoggedIn,
  async (req, res) => {
    const { commentId } = req.params;
    try {
      const deletedComment = await deleteCommunityPostComment(commentId);
      if (!deletedComment) {
        return res.status(404).json({ error: "Unable to delete comment" });
      }
      res.status(200).json({ message: "Comment deleted", deletedComment });
    } catch (err) {
      console.error("Error deleting comment:", err);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
);

module.exports = router;
