const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const {
  fetchPostsByCommunity,
  createCommunityPost,
  updateCommunityPost,
  deleteCommunityPost,
  fetchAllPosts,
  saveImage,
} = require("../db/communityPost");

const isLoggedIn = require("../middleware/isLoggedIn");
const { pool } = require("../db/index"); // For direct DB queries if needed

// 🔧 Configure Multer for image upload support
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("image");

// 1) Fetch ALL posts (regardless of community)
router.get("/all", async (req, res, next) => {
  try {
    const posts = await fetchAllPosts();
    console.log(posts);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// 2) Fetch all posts for a specific community
router.get("/:communityId/posts", async (req, res, next) => {
  try {
    const { communityId } = req.params;
    const posts = await fetchPostsByCommunity(communityId);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// 3) Create a new community post (support file or URL)
router.post("/:communityId/posts", isLoggedIn, async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) return res.status(500).json({ error: "Multer error: " + err.message });

    try {
      const { communityId } = req.params;
      const userId = req.user.id;
      const { content, title } = req.body;
      let imageUrl = req.body.imageUrl || null;
      let imgId = req.body.img_id ? req.body.img_id.toString() : null;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      if (req.file && imageUrl) {
        return res.status(400).json({ error: "Provide either a file OR an image URL, not both." });
      }

      if (req.file) {
        const imageRecord = await saveImage({
          filename: req.file.filename,
          filepath: `/uploads/${req.file.filename}`,
          userId,
        });

        if (!imageRecord?.id) {
          return res.status(500).json({ error: "Image saving failed." });
        }

        imgId = imageRecord.id;
        imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      }

      if (!imgId && !imageUrl) {
        return res.status(400).json({ error: "An image is required to create a post." });
      }

      const newPost = await createCommunityPost({
        userId,
        communityId,
        title,
        content,
        img_id: imgId,
        imageUrl,
      });

      return res.status(201).json({ message: "Community post created", newPost });
    } catch (err) {
      console.error("❌ Error creating community post:", err);
      next(err);
    }
  });
});

// 4) Update a post in a specific community (Requires Authentication)
router.put(
  "/:communityId/posts/:postId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      // Only allow update if the user is the post owner
      const updatedPost = await updateCommunityPost(postId, content, userId);
      return res.status(200).json(updatedPost);
    } catch (err) {
      console.error("❌ Error updating post:", err.message);
      res.status(403).json({ error: err.message });
    }
  }
);

// 5) Delete a post
router.delete(
  "/:communityId/posts/:postId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id; // from token

      // Check if the post exists
      const postCheck = await pool.query(
        "SELECT user_id, community_id FROM posts WHERE id = $1",
        [postId]
      );
      if (postCheck.rows.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      // If the user is the owner or an admin, allow deletion
      const postOwnerId = postCheck.rows[0].user_id;
      const communityId = postCheck.rows[0].community_id;

      const adminCheck = await pool.query(
        "SELECT * FROM community_members WHERE community_id = $1 AND user_id = $2 AND role = 'admin'",
        [communityId, userId]
      );

      if (postOwnerId !== userId && adminCheck.rows.length === 0) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this post" });
      }

      const deletedPost = await deleteCommunityPost(postId);
      return res
        .status(200)
        .json({ message: "Post deleted successfully", deletedPost });
    } catch (err) {
      console.error("❌ Error deleting post:", err);
      next(err);
    }
  }
);

module.exports = router;

