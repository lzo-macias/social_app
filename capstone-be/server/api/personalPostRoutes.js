const express = require("express");
const router = express.Router();

const {
  createPersonalPost,
  fetchPostsByUser,
  fetchPostbyId,
  deletePersonalPost,
} = require("../db/personalPost");

const isLoggedIn = require("../middleware/isLoggedIn");

//creates new personal post
router.post("/Post", isLoggedIn, async (req, res) => {
  const { content } = req.body;
  const user = req.user;

  if (!user || !user.id) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  if (!content) {
    return res.status(400).json({ error: "Content required" });
  }

  try {
    console.log("Request Body:", req.body);
    const newPost = await createPersonalPost({ userId: user.id, content });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err.message); // Log the error
    res
      .status(500)
      .json({ error: "Failed to create new post", details: err.message });
  }
});

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
