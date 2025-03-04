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
router.use("/communitiespost", communityPostRoutes);
router.use("/communities-post-comments", communityPostCommentRoutes);
router.use("/personal-post", personalPostRoutes);
router.use("/personal-post-comments", personalPostCommentRoutes);
=======
router.use("/communities", communityPostRoutes);
router.use("/communities", communityPostCommentRoutes);
router.use("/personal-post", personalPostRoutes);
router.use("/personal-post", personalPostCommentRoutes);
>>>>>>> tristan_branch4

module.exports = router;
