const { Client } = require('pg');
require("dotenv").config();
const client = new pg.Client();

const createTables = async () => {
  try {
<<<<<<< HEAD
    // await client.connect(); causing app to crash since client called at bottom
=======
    await client.connect();
>>>>>>> main
    console.log("Connected to the database!");
    const SQL = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- Make sure UUID generation is enabled
      
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS posts CASCADE;
      DROP TABLE IF EXISTS community_members CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS communities CASCADE;
<<<<<<< HEAD
=======
      DROP TABLE IF EXISTS images;

      CREATE TABLE images (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        filename VARCHAR(256) NOT NULL,
        filepath VARCHAR(512) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
>>>>>>> main

      CREATE TABLE users(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  -- Using UUID and auto-generating with uuid_generate_v4
        is_admin BOOLEAN NOT NULL,
        username VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        email VARCHAR(256) UNIQUE NOT NULL,
        dob DATE NOT NULL,
        visibility VARCHAR(64) DEFAULT 'public',
        profile_picture VARCHAR(512),
        bio TEXT,
        location VARCHAR(128),
        status VARCHAR(64) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

<<<<<<< HEAD
      CREATE TABLE communities(
=======
      CREATE TABLE communities (
>>>>>>> main
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(128) UNIQUE NOT NULL,
        description TEXT,
        admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
        visibility VARCHAR(64) DEFAULT 'public',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE community_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(64) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
<<<<<<< HEAD
=======
<<<<<<< HEAD
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for group messages
    group_id UUID REFERENCES communities(id) ON DELETE CASCADE, -- NULL for direct messages
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      `;
=======
>>>>>>> main
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sender_id UUID REFERENCES community_members(id) ON DELETE CASCADE,
        receiver_id UUID REFERENCES community_members(id) ON DELETE CASCADE,
        community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
<<<<<<< HEAD
=======
>>>>>>> main
>>>>>>> main
    console.log("Creating tables...");
    await client.query(SQL);
    console.log("Tables created!");
  } catch (err) {
<<<<<<< HEAD
    console.error("Error creating tables: ", err);
=======
    console.error("Error creating tables: ", "Error creating tables:", err);
>>>>>>> main
  }
};

module.exports = {
  client,
  createTables
};
