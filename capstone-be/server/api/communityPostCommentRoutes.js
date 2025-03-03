const express = require("express");
const router = express.Router();

const {
fetchCommentsByPostCommunity,
createCommunityPostComment,
updateCommunityPostComment,
deleteCommunityPostComment} = require("../db/communityPostComments")

const isLoggedIn = require("../middleware/isLoggedIn");
const { pool } = require("../db/index"); 

//Community post comment routes

//Post comment to community post

router.post(
  "/:communityId/:postId/comment", isLoggedIn,

  async (req, res, next) => {
    try {
      const {postId,communityId} = req.params;
      const createdbyId = req.user;
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

      res.status(201).json({ message: "Comment created", newComment });
    } catch (err) {
      console.error("❌ Error creating comment:", err);
      next(err);
    }
  }
);

// Gets all comments for a specific post
router.get("/:communityId/:postId/comments", isLoggedIn, async (req, res) => {
  try {
    const { postId, communityId} = req.params;
    const communityPostComments = await fetchCommentsByPostCommunity(postId);
    res.status(200).json(communityPostComments);
  } catch (err) {
    console.error("Error fetching comment:", err.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Updates a comment for a specific post
router.put("/:communityId/:postId/:commentId", isLoggedIn, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const result = await updateCommunityPostComment( commentId, comment );

    console.log("Comment updated!");
    res.status(200).json(result); // Send the updated profile
  } catch (err) {
    console.error("Error in PUT :communityId/:postId/:commentId", err);
    next(err); // Forward error to error handler
  }
});

// Deletes personal post
router.delete("/:communityId/:postId/:commentId", isLoggedIn, async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await deleteCommunityPostComment(commentId);

    if (!deletedComment) {
      return res.status(404).json({ error: "Unable to delete comment" });
    }

    res.status(200).json({ message: "comment deleted", deletedComment });
  } catch (err) {
    console.error("Error in DELETE /:postId/:commentId:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
