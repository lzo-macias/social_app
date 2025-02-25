require("dotenv").config();
const { client, createTables } = require("./db");
const { createUser, fetchUsers } = require("./db/users");
const { createCommunity, fetchCommunities } = require("./db/community");
const { createPost } = require("./db/post");
const { saveImage } = require("./db/img");

const seedDb = async () => {
  try {
    await client.connect();
    await createTables();

    let users = await fetchUsers();
    let communities = await fetchCommunities();

    // If no users or communities exist, create them
    if (!users.length || !communities.length) {
      console.log("Seeding users and communities...");

      // Create users
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
      ]);

      console.log("Users created!");

      // Create communities
      await Promise.all([
        createCommunity({
          name: "Test Community 1",
          description: "A test community for seeding.",
        }),
        createCommunity({
          name: "Test Community 2",
          description: "Another test community for seeding.",
        }),
      ]);

      console.log("Communities created!");

      // Fetch users and communities again after creating them
      users = await fetchUsers();
      communities = await fetchCommunities();
    }

    console.log(
      `Seeding community_members for ${users.length} users and ${communities.length} communities...`
    );

    // Insert users into communities
    for (let i = 0; i < Math.min(users.length, communities.length); i++) {
      await client.query(
        `INSERT INTO community_members (user_id, community_id) VALUES ($1, $2)`,
        [users[i].id, communities[i].id]
      );
    }

    console.log("Community members seeded successfully!");

    // Create posts for each user in their community
    console.log("Seeding posts...");
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const community = communities[i % communities.length]; // Ensures users get posts even if more users than communities

      await createPost({
        userId: user.id,
        communityId: community.id,
        content: `This is a test post from ${user.username} in community ${community.communityName}`,
      });
    }
    console.log("Posts seeded successfully!");

    // Seed the images table with sample image records
    console.log("Seeding images...");
    await Promise.all([
      saveImage({
        filename: "sample1.jpg",
        filepath: "/uploads/sample1.jpg",
      }),
      saveImage({
        filename: "sample2.jpg",
        filepath: "/uploads/sample2.jpg",
      }),
    ]);
    console.log("Images seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    client.end();
  }
};

seedDb();
