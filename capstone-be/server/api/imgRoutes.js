const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  saveImage,
  fetchAllImages,
  fetchImageByFilename,
  deleteImageByFilename,
  fetchImagesByUser, // ✅ Ensure this function exists in your `img.js`
} = require("../db/img");
const isLoggedIn = require("../middleware/isLoggedIn");

const router = express.Router();

router.use((req, res, next) => {
  console.log(`📢 Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Create folder if missing
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const sharp = require("sharp");


// ✅ Image Upload Route (Fix: Use `upload.single("image")`)
router.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const originalPath = req.file.path;
    const extension = path.extname(req.file.filename);           // e.g. '.jpg'
    const baseName = path.basename(req.file.filename, extension); // e.g. '17000000-image'

    // 🔧 Create resized versions
    const sizes = [
      { name: "small", width: 480 },
      { name: "medium", width: 800 },
    ];

    await Promise.all(
      sizes.map(({ name, width }) => {
        return sharp(originalPath)
          .resize({ width })
          .toFile(path.join(req.file.destination, `${baseName}_${name}${extension}`));
      })
    );

    // ✅ Save original image metadata
    const imageRecord = await saveImage({
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`,
      userId,
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      imgId: imageRecord.id,
      imageUrl: imageRecord.filepath,
    });
  } catch (err) {
    console.error("❌ Error uploading image:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});
// router.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
//   try {
//     const userId = req.user.id; // ✅ Get user ID from token
//     console.log("🖼️ Image Upload for User:", userId);

//     if (!req.file) {
//       return res.status(400).json({ error: "No image uploaded" });
//     }

//     // ✅ Save image metadata
//     const imageRecord = await saveImage({
//       filename: req.file.filename,
//       filepath: `/uploads/${req.file.filename}`,
//       userId, // ✅ Make sure your `images` table includes a `user_id` column
//     });
//     console.log("this is your imageRecord:",imageRecord);

//     res.status(201).json({
//       message: "Image uploaded successfully",
//       imgId: imageRecord.id,
//       imageUrl: imageRecord.filepath,
//     });
//   } catch (err) {
//     console.error("❌ Error uploading image:", err);
//     res.status(500).json({ error: "Failed to upload image" });
//   }
// });

// ✅ Fetch All Uploaded Images (Public)
router.get("/", async (req, res) => {
  try {
    const images = await fetchAllImages();
    res.json({ images });
  } catch (err) {
    console.error("❌ Error fetching images:", err);
    res.status(500).json({ error: "Error fetching images" });
  }
});

// ✅ Serve Static Images
router.get("/:filename", async (req, res) => {
  try {
    const image = await fetchImageByFilename(req.params.filename);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const filePath = path.join(__dirname, "../../uploads", image.filename);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("❌ Error sending file:", err);
        res.status(500).json({ error: "Error retrieving image file" });
      }
    });
  } catch (err) {
    console.error("❌ Error fetching image:", err);
    res.status(500).json({ error: "Error fetching image" });
  }
});

// ✅ Delete Image by Filename
router.delete("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    // ✅ Check if image exists before deleting
    const image = await fetchImageByFilename(filename);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // ✅ Delete Image
    const deletedImage = await deleteImageByFilename(filename);
    if (!deletedImage) {
      return res.status(500).json({ error: "Error deleting image" });
    }

    res.json({ message: "Image deleted successfully", image: deletedImage });
  } catch (err) {
    console.error("❌ Error deleting image:", err);
    res.status(500).json({ error: "Error deleting image" });
  }
});

// ✅ Fetch Images Uploaded by Logged-in User
router.get(
  "/user-images",
  (req, res, next) => {
    console.log("🛑 Middleware Check: isLoggedIn should execute next...");
    next();
  },
  isLoggedIn,
  async (req, res) => {
    console.log("📢 Route hit: GET /user-images");

    try {
      const userId = req.user.id; // ✅ Extract user ID from token
      console.log("🔍 Extracted User ID:", userId);

      const images = await fetchImagesByUser(userId);
      console.log("✅ Retrieved images:", images);

      if (!images || images.length === 0) {
        console.log("🚨 No images found for this user.");
        return res
          .status(404)
          .json({ error: "No images found for this user." });
      }

      res.status(200).json(images);
    } catch (err) {
      console.error("❌ Error fetching user images:", err);
      res.status(500).json({ error: "Failed to fetch images" });
    }
  }
);

module.exports = router;
