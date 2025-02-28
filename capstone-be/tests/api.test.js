const request = require("supertest");
const app = require("../app"); // Ensure app.js exports `app`
let token, userId, communityId, postId;

describe("🛠️ API Tests", () => {
  // ✅ Test User Registration
  it("Should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      is_admin: false,
      username: "testuser",
      password: "TestPassword123",
      email: "testuser@example.com",
      dob: "1995-06-15",
      visibility: "public",
      profile_picture: "https://example.com/profile.jpg",
      bio: "Hello, I'm a test user!",
      location: "New York, USA",
      status: "active",
    });

    expect(res.statusCode).toBe(201);
    token = res.body.token;
    userId = res.body.id;
  });

  // ✅ Test User Login
  it("Should log in a user and return a JWT token", async () => {
    const res = await request(app).post("/api/users/login").send({
      username: "testuser",
      password: "TestPassword123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  // ✅ Test Community Creation
  it("Should create a new community", async () => {
    const res = await request(app)
      .post("/api/communities")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Community",
        description: "This is a test community",
      });

    expect(res.statusCode).toBe(201);
    communityId = res.body.id;
  });

  // ✅ Test Fetching All Communities
  it("Should fetch all communities", async () => {
    const res = await request(app).get("/api/communities");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // ✅ Test Community Update (Admin Only)
  it("Should update a community", async () => {
    const res = await request(app)
      .put(`/api/communities/${communityId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Test Community",
        description: "Updated description",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Test Community");
  });

  // ✅ Test Create Community Post
  it("Should create a post in a community", async () => {
    const res = await request(app)
      .post(`/api/communities/${communityId}/posts`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        content: "This is a test post in the community",
      });

    expect(res.statusCode).toBe(201);
    postId = res.body.id;
  });

  // ✅ Test Fetching Community Posts
  it("Should fetch all posts from a community", async () => {
    const res = await request(app).get(`/api/communities/${communityId}/posts`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // ✅ Test Update a Post
  it("Should update a post", async () => {
    const res = await request(app)
      .put(`/api/communities/${communityId}/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Updated post content" });

    expect(res.statusCode).toBe(200);
  });

  // ✅ Test Delete a Post
  it("Should delete a post", async () => {
    const res = await request(app)
      .delete(`/api/communities/${communityId}/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  // ✅ Test Upload Image
  it("Should upload an image", async () => {
    const res = await request(app)
      .post("/api/images/upload")
      .set("Authorization", `Bearer ${token}`)
      .attach("image", "tests/sample.jpg");

    expect(res.statusCode).toBe(200);
  });

  // ✅ Test Fetching All Images
  it("Should fetch all uploaded images", async () => {
    const res = await request(app).get("/api/images");
    expect(res.statusCode).toBe(200);
    expect(res.body.images).toBeInstanceOf(Array);
  });

  // ✅ Test Sending a Direct Message
  it("Should send a direct message", async () => {
    const res = await request(app)
      .post("/api/messages/direct")
      .set("Authorization", `Bearer ${token}`)
      .send({
        sender_id: userId,
        receiver_id: userId,
        content: "Hello, this is a test message!",
      });

    expect(res.statusCode).toBe(200);
  });

  // ✅ Test Fetching Direct Messages
  it("Should fetch direct messages", async () => {
    const res = await request(app)
      .get(`/api/messages/direct/${userId}/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  // ✅ Test Delete User (Self)
  it("Should delete the user", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});

//api routes tester. npm install --save-dev jest supertest
// "scripts": {
//   "test": "jest --runInBand"
// }
