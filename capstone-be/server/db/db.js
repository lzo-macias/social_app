const pg = require("pg");
require("dotenv").config();
const client = new pg.Client();
const { v4: uuidv4 } = require("uuid"); // Import uuid for generating UUIDs

const createTables = async () => {
  try {
    const SQL = `
      DROP TABLE IF EXISTS messages;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS community_members;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS communities;
      CREATE TABLE users(
        id UUID SERIAL PRIMARY KEY, 
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
  
      CREATE TABLE communities(
        id UUID SERIAL PRIMARY KEY,
        name VARCHAR(128) UNIQUE NOT NULL,
        description TEXT,
        admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        visibility VARCHAR(64) DEFAULT 'public', 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
      CREATE TABLE community_members (
        id UUID SERIAL PRIMARY KEY,
        community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(64) DEFAULT 'member',  
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
      CREATE TABLE posts (
        id UUID SERIAL PRIMARY KEY,
        community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    console.log("Creating tables...");
    await client.query(SQL);
    console.log("Tables created!");
  } catch (err) {
    console.error(err);
  }
};
