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

    // Always seed the users and communities regardless of existing data.
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

    console.log(
      `Seeding community_members for ${users.length} users and ${communities.length} communities...`
    );

    for (let i = 0; i < Math.min(users.length, communities.length); i++) {
      await pool.query(
        `INSERT INTO community_members (user_id, community_id) VALUES ($1, $2)`,
        [users[i].id, communities[i].id]
      );
    }

    console.log("Community members seeded successfully!");

    console.log("Seeding posts...");
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const community = communities[i % communities.length];

      const newPost = await createCommunityPost({
        userId: user.id,
        communityId: community.id,
        content: `This is a test post from ${user.username} in community ${community.name}`,
      });

      console.log("New post created:", newPost);
    }
    console.log("Posts seeded successfully!");

    for (const community of communities) {
      const posts = await fetchPostsByCommunity(community.id);
      console.log(`Posts for ${community.name}:`, posts);
    }

    console.log("Seeding personal posts...");
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const newPost = await createPersonalPost({
        userId: user.id,
        content: `This is a test post from ${user.username} `,
      });

      console.log("New personal post created:", newPost);
    }
    console.log("Personal posts seeded successfully!");

    console.log("Seeding images...");
    // Uncomment and update the image seeding as needed:
    // await Promise.all([
    //   saveImage({
    //     filename: "sample1.jpg",
    //     filepath: "/uploads/sample1.jpg",
    //   }),
    //   saveImage({
    //     filename: "sample2.png",
    //     filepath: "/uploads/sample2.png",
    //   }),
    // ]);
    console.log(await fetchAllImages());
    console.log("Images seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await pool.end(); // Close the connection properly
  }
};

seedDb();
