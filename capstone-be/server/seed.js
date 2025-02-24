require("dotenv").config();
const { Pool } = require("pg");

// Set up connection pool with default options (empty object)
const pool = new Pool();

const { createTables } = require("./db/db");
const { createUser, fetchUsers } = require("./db/users");

const seedDb = async () => {
  const client = await pool.connect();  // Get a client from the pool
  try {
    await createTables(client);

    console.log("Creating users...");
    await Promise.all([
      createUser(client, {
        username: "john_doe",
        password: "password123",
        email: "john@example.com",
        name: "John Doe",
        dob: "1990-05-15",
        is_admin: true,
      }),
      createUser(client, {
        username: "jane_smith",
        password: "securepass",
        email: "jane@example.com",
        name: "Jane Smith",
        dob: "1995-08-22",
        is_admin: false,
      }),
      createUser(client, {
        username: "alice_wonder",
        password: "wonderland",
        email: "alice@example.com",
        name: "Alice Wonderland",
        dob: "1988-12-01",
        is_admin: false,
      }),
    ]);

    console.log("Users created!");
    console.log(await fetchUsers(client));  // Fetch users
  } catch (err) {
    console.error(err);
  } finally {
    client.release();  // Release the client back to the pool
  }
};

seedDb();

const init = async () => {
  try {
    console.log("Seeding database...");
    await seedDb(); // Ensure seedDb finishes before starting server
    console.log("Database seeded!");
  } catch (err) {
    console.error("Error during initialization:", err);
  }
};

module.exports = seedDb;
