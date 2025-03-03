const express = require("express");
const userRoutes = require("./userRoutes");
const communityRoutes = require("./communityRoutes");
//const communityMemberRoutes = require("./communityMemberRoutes");
const messageRoutes = require("./messageRoutes");
const imgRoutes = require("./imgRoutes"); //Import image routes
const communityPostRoutes = require("./communityPostRoutes");
const communityPostCommentRoutes = require("./communityPostCommentRoutes");
const personalPostRoutes = require("./personalPostRoutes");
const personalPostCommentRoutes = require("./personalPostCommentRoutes"); // import personal post routes

const router = express.Router();

// Attach all routes
router.use("/users", userRoutes);
router.use("/communities", communityRoutes);
//router.use("/community-members", communityMemberRoutes);
router.use("/messages", messageRoutes);
router.use("/images", imgRoutes);
<<<<<<< HEAD
router.use("/communities", communityPostRoutes);
router.use("/communities", communityPostCommentRoutes);
router.use("/personal-post", personalPostRoutes);
router.use("/personal-post", personalPostCommentRoutes);
=======
router.use("/communityPosts", communityPostRoutes);
router.use("/personalPost", personalPostRoutes);
>>>>>>> 8cb43d3b2f9e6306f4c561eb7b31e32a3c57f0cb

module.exports = router;
