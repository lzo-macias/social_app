const { createCommunityPost, fetchCommunityPosts } = require("../db/communityPost");

// Simulated function for seeding database
const seedDb = async () => {
  try {
    console.log("🌱 Seeding community posts...");

    const posts = [
      { user_id: "38a2412f-7671-4974-b929-92f72c6c3445", community_id: "8beb65c0-2824-4df7-8956-59b7be576da6", title: "First Post", content: "This is a post in Community by Another User." },
      { user_id: "a9993ba2-2790-43f3-80f6-260c28960deb", community_id: "7780b044-ef0e-47b3-bab0-bf3a8619bdea", title: "Second Post", content: "Another post in Test Community 1." }
    ];

    for (const post of posts) {
      if (!post.user_id || !post.community_id || !post.title) {
        console.error("⚠️ Skipping post due to missing data:", post);
        continue;
      }

      const newPost = await createCommunityPost(post);
      if (newPost) {
        console.log("✅ New post created:", newPost);
      }
    }

    console.log("✅ Community posts seeded successfully!");

  } catch (err) {
    console.error("❌ Error seeding community posts:", err);
  }
};

// Run the seeding function
seedDb();
