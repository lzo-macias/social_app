require("dotenv").config();
const { client,createTables} = require("./db/db");
const { createUser, fetchUsers } = require("./db/users");

const seedDb = async () => {
  try {
    await client.connect();
    await createTables();

    console.log("Creating users...");
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
    console.log(await fetchUsers());
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
  }
};

seedDb();
