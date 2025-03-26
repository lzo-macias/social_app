const { pool } = require("./db");
const { createTables } = require("./db/db.js");
const { createCommunityPost } = require("./db/communityPost.js");
const { createUser, fetchUsers } = require("./db/users.js");
const { createCommunity, fetchCommunities } = require("./db/community.js");
const { fetchPostsByCommunity } = require("./db/communityPost.js");
const { createPersonalPostComment } = require("./db/personalPostComments.js");
const { saveImage, fetchAllImages } = require("./db/img.js");
const { createPersonalPost } = require("./db/personalPost.js");

const seedDb = async () => {
  try {
    await createTables(); // Create (or recreate) tables in the database

    // Seeding Users
    console.log("Seeding users and communities...");

    await Promise.all([
      createUser({
        username: "john_doe",
        password: "password123",
        email: "john@example.com",
        name: "John Doe",
        dob: "1990-05-15",
        is_admin: true,
      }),
      createUser({
        username: "jane_smith",
        password: "securepass",
        email: "jane@example.com",
        name: "Jane Smith",
        dob: "1995-08-22",
        is_admin: false,
      }),
      createUser({
        username: "alice_wonder",
        password: "wonderland",
        email: "alice@example.com",
        name: "Alice Wonderland",
        dob: "1988-12-01",
        is_admin: false,
      }),
      createUser({
        username: "I-Am-Admin",
        password: "admin123",
        email: "admin@example.com",
        name: "Admin Adams",
        dob: "1988-12-01",
        is_admin: true,
      }),
      createUser({
        username: "Not-Admin-But-Creator",
        password: "notadmin123",
        email: "notadmin@example.com",
        name: "NOT-ADMIN BUT-CREATOR",
        dob: "1988-12-01",
        is_admin: false,
      }),
    ]);

    let users = await fetchUsers();
    console.log("Users created!", users);

    // Seeding Images
    const imageIds = await Promise.all([
      saveImage({
        filename: "sample1.jpg",
        filepath: "sample1.jpg",
        userId: users[Math.floor(Math.random() * users.length)].id,
      }),
      saveImage({
        filename: "sample2.jpg",
        filepath: "sample2.jpg",
        userId: users[Math.floor(Math.random() * users.length)].id,
      }),
      saveImage({
        filename: "sample3.jpg",
        filepath: "sample3.jpg",
        userId: users[Math.floor(Math.random() * users.length)].id,
      }),
      saveImage({
        filename: "sample4.jpg",
        filepath: "sample4.jpg",
        userId: users[Math.floor(Math.random() * users.length)].id,
      }),
      saveImage({
        filename: "sample5.jpg",
        filepath: "sample5.jpg",
        userId: users[Math.floor(Math.random() * users.length)].id,
        // imgUrl: "/uploads/sample5.jpg"
      }),
    ]);

    await Promise.all([
      createCommunity({
        name: "Animal Lovers",
        description: "A community for all animal lovers.",
        createdBy: users[0].id, // Assign first user as admin
      }),
      createCommunity({
        name: "Test Community 2",
        description: "Another test community for seeding.",
        createdBy: users[1].id, // Assign second user as admin
      }),
      createCommunity({
        name: "Community by Creator",
        description: "A community created by Not-Admin-But-Creator",
        createdBy: users.find((u) => u.username === "Not-Admin-But-Creator").id,
      }),
      createCommunity({
        name: "Community by Another User",
        description: "A community created by a different user",
        createdBy: users.find((u) => u.username === "john_doe").id,
      }),
    ]);

    let communities = await fetchCommunities();
    console.log("Communities created!", communities);

    console.log("Seeding posts...");

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const community = communities[i % communities.length];
      const img_id = imageIds[Math.floor(Math.random() * imageIds.length)].id;

      const newPost = await createCommunityPost({
        userId: user.id,
        communityId: community.id,
        title: `This is a test post from ${user.username} in community ${community.name}`,
        content: `This is a test post from ${user.username} in community ${community.name}`,
        img_id: img_id,
        imageUrl: img_id
      });

      console.log("New community post created:", newPost);
    }

    console.log("Seeding personal posts...");

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log("users:", users[i])
      const img_id = imageIds[Math.floor(Math.random() * imageIds.length)].id;
      console.log("img_id:", img_id)

      const newPost = await createPersonalPost({
        userId: user.id,
        content: `This is a test post from ${user.username} `,
        img_id: img_id,
      });

      console.log("New personal post created:", newPost);
    }

    console.log("Personal posts seeded successfully!");
    console.log("Images seeded successfully!");

  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end(); // Close the connection properly
  }
};

seedDb();
