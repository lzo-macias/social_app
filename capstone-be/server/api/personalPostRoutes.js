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
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { content, imageUrl } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      let imgId = null;

      if (req.file) {
        // ✅ Save uploaded image in DB
        const imageRecord = await saveImage({
          filename: req.file.filename,
          filepath: `/uploads/${req.file.filename}`,
        });
        imgId = imageRecord.id; // ✅ Use imgId from uploaded image
      }

      // ✅ Create personal post (use uploaded imgId OR provided imageUrl)
      const newPost = await createPersonalPost({
        userId,
        content,
        imgId,
        imgUrl: imageUrl || null, // Store URL if provided
      });

      res.status(201).json({ message: "Post created successfully", newPost });
    } catch (err) {
      console.error("❌ Error creating personal post:", err);
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
router.delete("/post/:postId", isLoggedIn, async (req, res) => {
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

module.exports = router;
