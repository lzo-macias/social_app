const express = require("express");
const router = express.Router();

const {
  createPersonalPostComment,
  fetchPersonalPostComment,
  updatePersonalPostComment,
  deletePersonalPostComment,
} = require("../db/personalPostComments");

const isLoggedIn = require("../middleware/isLoggedIn");

//post comment to personal post

router.post(
    "/:postId/comment", isLoggedIn,
  
    async (req, res, next) => {
      try {
        const {postId} = req.params;
        const user = typeof req.user === "string" ? JSON.parse(req.user) : req.user;
        console.log("User:", user);
        const createdbyId = user.id;
        const { comment } = req.body;
  
        if (!comment) {
          return res.status(400).json({ error: "Comment is required" });
        }
  
        const newComment = await createPersonalPostComment({
          postId,
          createdbyId,
          comment,
        });
  
        res.status(201).json(newComment);
      } catch (err) {
        console.error("❌ Error creating comment:", err);
        next(err);
      }
    }
  );
  
  // Gets all comments for a specific post
  router.get("/:postId/comments", isLoggedIn, async (req, res) => {
    try {
      const { postId } = req.params;
      const personalPostComments = await fetchPersonalPostComment({postId});
      res.status(200).json(personalPostComments);
    } catch (err) {
      console.error("Error fetching comment:", err.message);
      res.status(500).json({ error: "Failed to fetch post" });
    }
  });
  
  // Updates a comment for a specific post
  router.put("/:postId/:commentId", isLoggedIn, async (req, res, next) => {
    try {
      const { postId, commentId} = req.params;
      const { comment } = req.body;
      const result = await updatePersonalPostComment({ postId, commentId, comment });
  
      console.log("Comment updated!");
      res.status(200).json(result); // Send the updated profile
    } catch (err) {
      console.error("Error in PUT /:postId/:commentId", err);
      next(err); // Forward error to error handler
    }
  });
  
  // Deletes personal post
  router.delete("/:postId/:commentId", isLoggedIn, async (req, res) => {
    const { postId, commentId } = req.params;
    try {
      const deletedComment = await deletePersonalPostComment(commentId);
  
      if (!deletedComment) {
        return res.status(404).json({ error: "Unable to delete comment" });
      }
  
      res.status(200).json({ message: "comment deleted", deletedComment });
    } catch (err) {
      console.error("Error in DELETE /:postId/:commentId:", err);
      res.status(500).json({ error: "Failed to delete post" });
    }
  });
  
  module.exports = router;