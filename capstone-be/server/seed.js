// const fs = require("fs");
// const path = require("path");
// const { pool } = require("./db");
// const { createTables } = require("./db/db.js");
// const { createCommunityPost } = require("./db/communityPost.js");
// const { createUser } = require("./db/users.js");
// const { createCommunity, addUserToCommunity } = require("./db/community.js");
// const { saveImage } = require("./db/img.js");
// const { createPersonalPost } = require("./db/personalPost.js");
// const { v4: uuidv4 } = require("uuid");

// const USER_IMAGE_DIR = path.join(__dirname, "../uploads/userprofilepicturesseed");
// const POST_IMAGE_DIR = path.join(__dirname, "../uploads/postseed");

// const communityThemes = [
//   "Photography", "Fitness", "Cooking", "Books", "Gaming", "Nature", "Pets", 
//   "Cars", "Fashion", "Tech", "Startups", "Memes", "Movies", "Travel", 
//   "Design", "Crypto", "AI", "Spirituality", "Parenting", "Education", 
//   "Finance", "Skincare", "Interior Design", "Music", "Hiking",
//   "Mental Health", "Art", "Language Learning", "Politics", "News"
// ];

// const toFolderName = (str) => str.toLowerCase().replace(/\s+/g, "");

// const seedDb = async () => {
//   try {
//     await createTables();

//     const profileImages = fs.readdirSync(USER_IMAGE_DIR).filter(f => f.endsWith(".jpg"));
//     const users = [];

//     for (let i = 0; i < 100; i++) {
//       const imageFile = profileImages[i % profileImages.length];
//       const username = `user${i + 1}`;
//       const email = `${username}@example.com`;

//       const user = await createUser({
//         username,
//         password: "password",
//         email,
//         name: `User ${i + 1}`,
//         dob: "1990-01-01",
//         is_admin: i < 30
//       });

//       const filepath = path.join(USER_IMAGE_DIR, imageFile);
//       const image = await saveImage({ filename: imageFile, filepath, userId: user.id });

//       await pool.query(`UPDATE users SET profile_picture = $1 WHERE id = $2`, [image.filepath, user.id]);
//       users.push(user);
//     }

//     console.log("✅ Seeded 100 users with profile images");

//     const communities = await Promise.all(
//       communityThemes.map(async (theme, i) => {
//         const admin = users[i];
//         const folderName = toFolderName(theme);
//         const seedDir = path.join(POST_IMAGE_DIR, folderName);
//         const seedImages = fs.readdirSync(seedDir).filter(f => f.endsWith(".jpg"));
//         const communityImageFile = seedImages[Math.floor(Math.random() * seedImages.length)];

//         const image = await saveImage({
//           filename: communityImageFile,
//           filepath: path.join(seedDir, communityImageFile),
//           userId: admin.id
//         });

//         const community = await createCommunity({
//           name: theme,
//           description: `Welcome to the ${theme} community!`,
//           createdBy: admin.id,
//           // imageUrl: image.filepath
//           imageUrl: `/uploads/${image.filename}`
//         });

//         return community;
//       })
//     );

//     console.log("✅ Seeded 30 communities");

//     // --- Link each user to 5 random communities ---
//     for (const user of users) {
//       const shuffled = communities.sort(() => 0.5 - Math.random());
//       const selectedCommunities = shuffled.slice(0, 5);

//       for (const community of selectedCommunities) {
//         await addUserToCommunity(community.id, user.id);
//       }
//     }

//     let totalCommunityAndUser = 250;
//     let totalUserOnly = 375;
//     let totalCommunityOnly = 375;

//     for (const community of communities) {
//       const folderName = toFolderName(community.name);
//       const seedDir = path.join(POST_IMAGE_DIR, folderName);
//       const seedImages = fs.readdirSync(seedDir).filter(f => f.endsWith(".jpg"));

//       for (let img of seedImages) {
//         const user = users[Math.floor(Math.random() * users.length)];
//         const image = await saveImage({ filename: img, filepath: path.join(seedDir, img), userId: user.id });

//         if (totalCommunityAndUser > 0) {
//           await createCommunityPost({
//             userId: user.id,
//             communityId: community.id,
//             title: `${community.name} - Community & User Post`,
//             content: `A great ${community.name} moment!`,
//             img_id: image.id
//           });
//           await createPersonalPost({
//             userId: user.id,
//             content: `A shared moment in ${community.name}`,
//             img_id: image.id
//           });
//           totalCommunityAndUser--;
//         } else if (totalUserOnly > 0) {
//           await createPersonalPost({
//             userId: user.id,
//             content: `Personal update from ${user.username}`,
//             img_id: image.id
//           });
//           totalUserOnly--;
//         } else if (totalCommunityOnly > 0) {
//           await createCommunityPost({
//             userId: user.id,
//             communityId: community.id,
//             title: `${community.name} - Community Only`,
//             content: `Community-only post from ${user.username}`,
//             img_id: image.id
//           });
//           totalCommunityOnly--;
//         }

//         if (totalCommunityAndUser === 0 && totalUserOnly === 0 && totalCommunityOnly === 0) break;
//       }
//       if (totalCommunityAndUser === 0 && totalUserOnly === 0 && totalCommunityOnly === 0) break;
//     }

//     console.log("✅ Seeded 1000 total posts (250 both, 375 personal, 375 community)");
//   } catch (err) {
//     console.error("❌ Error seeding database:", err);
//   } finally {
//     await pool.end();
//   }
// };

// seedDb();

const fs = require("fs");
const path = require("path");
const { pool } = require("./db");
const { createTables } = require("./db/db.js");
const { createCommunityPost } = require("./db/communityPost.js");
const { createUser } = require("./db/users.js");
const { createCommunity, addUserToCommunity } = require("./db/community.js");
const { saveImage } = require("./db/img.js");
const { createPersonalPost } = require("./db/personalPost.js");
const { v4: uuidv4 } = require("uuid");
const fse = require("fs-extra"); // npm install fs-extra


const USER_IMAGE_DIR = path.join(__dirname, "../uploads/userprofilepicturesseed");
const POST_IMAGE_DIR = path.join(__dirname, "../uploads/postseed");

const communityThemes = [
  "Photography", "Fitness", "Cooking", "Books", "Gaming", "Nature", "Pets", 
  "Cars", "Fashion", "Tech", "Startups", "Memes", "Movies", "Travel", 
  "Design", "Crypto", "AI", "Spirituality", "Parenting", "Education", 
  "Finance", "Skincare", "Interior Design", "Music", "Hiking",
  "Mental Health", "Art", "Language Learning", "Politics", "News"
];


const copyToUploads = async (srcPath, destFilename) => {
  const destPath = path.join(__dirname, "../uploads", destFilename);
  await fse.copy(srcPath, destPath);
  return destPath;
};

const toFolderName = (str) => str.toLowerCase().replace(/\s+/g, "");

const seedDb = async () => {
  try {
    await createTables();

    const profileImages = fs.readdirSync(USER_IMAGE_DIR).filter(f => f.endsWith(".jpg"));
    const users = [];

    for (let i = 0; i < 100; i++) {
      const imageFile = profileImages[i % profileImages.length];
      const username = `user${i + 1}`;
      const email = `${username}@example.com`;

      const user = await createUser({
        username,
        password: "password",
        email,
        name: `User ${i + 1}`,
        dob: "1990-01-01",
        is_admin: i < 30
      });

      const sourcePath = path.join(USER_IMAGE_DIR, imageFile);
      const copiedPath = await copyToUploads(sourcePath, imageFile); // ✅ Copy to /uploads

const image = await saveImage({
  filename: imageFile,
  filepath: copiedPath, // ✅ Now truly lives in /uploads
  userId: user.id
});

      await pool.query(`UPDATE users SET profile_picture = $1 WHERE id = $2`, [image.filepath, user.id]);
      users.push(user);
    }

    console.log("✅ Seeded 100 users with profile images");

    const communities = await Promise.all(
      communityThemes.map(async (theme, i) => {
        const admin = users[i];
        const folderName = toFolderName(theme);
        const seedDir = path.join(POST_IMAGE_DIR, folderName);
        const seedImages = fs.readdirSync(seedDir).filter(f => f.endsWith(".jpg"));
        const communityImageFile = seedImages[Math.floor(Math.random() * seedImages.length)];

        // const image = await saveImage({
        //   filename: communityImageFile,
        //   filepath: path.join(seedDir, communityImageFile),
        //   userId: admin.id
        // });
        const sourcePath = path.join(seedDir, communityImageFile);
const copiedPath = await copyToUploads(sourcePath, communityImageFile);
const image = await saveImage({ filename: communityImageFile, filepath: copiedPath, userId: admin.id });

        const community = await createCommunity({
          name: theme,
          description: `Welcome to the ${theme} community!`,
          createdBy: admin.id,
          // imageUrl: image.filepath
          imageUrl: `/uploads/${image.filename}`
        });

        return community;
      })
    );

    console.log("✅ Seeded 30 communities");

    // --- Link each user to 5 random communities ---
    for (const user of users) {
      const shuffled = communities.sort(() => 0.5 - Math.random());
      const selectedCommunities = shuffled.slice(0, 5);

      for (const community of selectedCommunities) {
        await addUserToCommunity(community.id, user.id);
      }
    }

    let totalCommunityAndUser = 250;
    let totalUserOnly = 375;
    let totalCommunityOnly = 375;

    for (const community of communities) {
      const folderName = toFolderName(community.name);
      const seedDir = path.join(POST_IMAGE_DIR, folderName);
      const seedImages = fs.readdirSync(seedDir).filter(f => f.endsWith(".jpg"));

      for (let img of seedImages) {
        const user = users[Math.floor(Math.random() * users.length)];
        // const image = await saveImage({ filename: img, filepath: path.join(seedDir, img), userId: user.id });
        const sourcePath = path.join(seedDir, img);
const copiedPath = await copyToUploads(sourcePath, img);
const image = await saveImage({ filename: img, filepath: copiedPath, userId: user.id });

        if (totalCommunityAndUser > 0) {
          await createCommunityPost({
            userId: user.id,
            communityId: community.id,
            title: `${community.name} - Community & User Post`,
            content: `A great ${community.name} moment!`,
            img_id: image.id
          });
          await createPersonalPost({
            userId: user.id,
            content: `A shared moment in ${community.name}`,
            img_id: image.id
          });
          totalCommunityAndUser--;
        } else if (totalUserOnly > 0) {
          await createPersonalPost({
            userId: user.id,
            content: `Personal update from ${user.username}`,
            img_id: image.id
          });
          totalUserOnly--;
        } else if (totalCommunityOnly > 0) {
          await createCommunityPost({
            userId: user.id,
            communityId: community.id,
            title: `${community.name} - Community Only`,
            content: `Community-only post from ${user.username}`,
            img_id: image.id
          });
          totalCommunityOnly--;
        }

        if (totalCommunityAndUser === 0 && totalUserOnly === 0 && totalCommunityOnly === 0) break;
      }
      if (totalCommunityAndUser === 0 && totalUserOnly === 0 && totalCommunityOnly === 0) break;
    }

    console.log("✅ Seeded 1000 total posts (250 both, 375 personal, 375 community)");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  } finally {
    await pool.end();
  }
};

seedDb();
