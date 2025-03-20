const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { saveImage } = require("../db/img");
const {
  createPersonalPost,
  fetchPostsByUser,
  fetchPostbyId,
  fetchUserIdByUsername,
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

const upload = multer({ storage: storage }).single("image");

// ✅ Create personal post with image upload (Requires Authentication)
router.post("/post", isLoggedIn, async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Multer error: " + err.message });
    }

    try {
      console.log("🔍 Received Request from Frontend:");
      console.log("➡️ Headers:", req.headers);
      console.log("➡️ Body:", req.body);
      console.log("➡️ Image File:", req.file);

      const userId = req.user.id;
      const { content } = req.body;
      let imageUrl = req.body.imageUrl || null;
      let imgId = req.body.imgId ? req.body.imgId.toString() : null;

      if (!content) {
        console.error("❌ Error: Missing Content in Request");
        return res.status(400).json({ error: "Content is required" });
      }

      // ✅ Ensure only one image input method is used
      if (req.file && imageUrl) {
        console.error("❌ Error: Both File and Image URL Provided");
        return res.status(400).json({
          error:
            "Cannot upload a file and provide an image URL at the same time.",
        });
      }

      // ✅ Handle file upload scenario
      if (req.file) {
        console.log("🖼️ File Uploaded:", req.file.filename);
        const imageRecord = await saveImage({
          filename: req.file.filename,
          filepath: `/uploads/${req.file.filename}`, // File path for storage
        });

        if (!imageRecord || !imageRecord.id) {
          console.error("❌ Error: Image saving failed.");
          return res.status(500).json({ error: "Image saving failed." });
        }

        imgId = imageRecord.id;
        imageUrl = `http://localhost:5000/uploads/${req.file.filename}`; // ✅ Store the full URL for uploaded images
      }

      // ✅ Ensure at least one valid image input
      if (!imgId && !imageUrl) {
        console.error("❌ Error: No image provided.");
        return res
          .status(400)
          .json({ error: "An image is required to create a post." });
      }

      console.log(
        "✅ Valid Image Data Found: imgId =",
        imgId,
        ", imageUrl =",
        imageUrl
      );

      // ✅ Validate `imgId` is a UUID
      if (imgId && !/^[0-9a-fA-F-]{36}$/.test(imgId)) {
        console.error("❌ Error: Invalid imgId Format:", imgId);
        return res
          .status(400)
          .json({ error: "Invalid imgId format. Must be a UUID." });
      }

      console.log("🚀 imgId Before Database Insertion:", imgId);
      console.log("🚀 imgId Type:", typeof imgId);

      // ✅ Create the post
      const newPost = await createPersonalPost({
        userId,
        content,
        imgId: imgId || null,
        imgUrl: imageUrl || null, // ✅ Store the correct `img_url`
      });

      console.log("✅ Post Created Successfully:", newPost);
      res.status(201).json({ message: "Post created successfully", newPost });
    } catch (err) {
      console.error("❌ Error creating personal post:", err);
      next(err);
    }
  });
});

// Gets all posts for specifc user
//removed isLoggedIn middlewear
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔍 Received userId:", userId); // Log received userId

    // First, fetch the actual UUID for the given username
    const userResult = await fetchUserIdByUsername(userId);
    if (!userResult) {
      return res.status(404).json({ error: "User not found" });
    }

    const userIdFromDb = userResult.id; // The actual UUID
    console.log("Fetched userId from database:", userIdFromDb);

    // Now, fetch the posts using the actual UUID
    const personalPosts = await fetchPostsByUser(userIdFromDb);
    res.status(200).json(personalPosts);
  } catch (err) {
    console.error("❌ Error fetching post:", err.message);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Gets a post by Id
router.get("/post/:postId", async (req, res) => {
  try {
    const post = await fetchPostbyId(req.params.postId);
    console.log("THIS IS THE POST YOU PULLED:", post)

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("🚀 Debug: Sending Post Response", post); // ✅ Ensure img_url is in API response

    res.json(post); // ✅ Send post object including img_url
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

//Update post
router.put("/post/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const result = await UpdatePersonalPost({ postId, content });

    console.log("Post updated!");
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

module.exports = router;
