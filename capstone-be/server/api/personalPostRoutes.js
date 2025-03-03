const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { saveImage } = require("../db/img");
const {
  createPersonalPost,
  fetchPostsByUser,
  fetchPostbyId,
  UpdatePersonalPost,
  deletePersonalPost,
} = require("../db/personalPost");

const {
  createPersonalPostComment,
  fetchPersonalPostComment,
  updatePersonalPostComment,
  deletePersonalPostComment,
} = require("../db/personalPostComments");

const isLoggedIn = require("../middleware/isLoggedIn");

// ✅ Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ✅ Create personal post with image upload (Requires Authentication)
router.post(
  "/post",

  upload.single("image"),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Image is required" });
      }

      // ✅ Save image in the database
      const imageRecord = await saveImage({
        filename: req.file.filename,
        filepath: `/uploads/${req.file.filename}`,
      });

      // ✅ Create personal post with `img_id`
      const newPost = await createPersonalPost({
        userId,
        content,
        imgId: imageRecord.id, // ✅ Assign the image ID to the post
      });

      res.status(201).json({ message: "Post created with image", newPost });
    } catch (err) {
      console.error("❌ Error creating personal post with image:", err);
      next(err);
    }
  }
);

// Gets all posts for specifc user
router.get("/:userId", isLoggedIn, async (req, res) => {
  try {
    const { userId } = req.params;
    const personalPosts = await fetchPostsByUser(userId);
    res.status(200).json(personalPosts);
  } catch (err) {
    console.error("Error fetching post:", err.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Gets a post by Id
router.get("/post/:postId", isLoggedIn, async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("Received postId:", postId);
    const post = await fetchPostbyId(postId);
    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.put("/post/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const result = await UpdatePersonalPost({ postId, content });

    console.log("Profile updated!");
    res.status(200).json(result); // Send the updated profile
  } catch (err) {
    console.error("Error in PUT /posts/:postId", err);
    next(err); // Forward error to error handler
  }
});

// Deletes personal post
router.delete("/post/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const deletedPost = await deletePersonalPost(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted", deletedPost });
  } catch (err) {
    console.error("Error in DELETE /PersonalPost/:postId:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

//personal post comment routes

//post comment to personal post

router.post(
  "/:postId/comment",

  async (req, res, next) => {
    try {
      const {postId} = req.params;
      const userId = req.user.id;
      const { comment } = req.body;

      if (!comment) {
        return res.status(400).json({ error: "Comment is required" });
      }

      const newComment = await createPersonalPostComment({
        postId,
        userId,
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
router.get("/:postId/comments", isLoggedIn, async (req, res) => {
  try {
    const { postId } = req.params;
    const personalPostComments = await fetchPersonalPostComment(postId);
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

    if (!deletedPost) {
      return res.status(404).json({ error: "Unable to delete comment" });
    }

    res.status(200).json({ message: "comment deleted", deletedComment });
  } catch (err) {
    console.error("Error in DELETE /:postId/:commentId:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

module.exports = router;
