const { pool } = require("./index"); // Use pool instead of client

const createTables = async () => {
  try {
    console.log("Creating tables...");

    const SQL = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create users table first because others reference it
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        is_admin BOOLEAN NOT NULL DEFAULT false,
        username VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        email VARCHAR(256) UNIQUE NOT NULL,
        name VARCHAR(128),
        dob DATE NOT NULL,
        visibility VARCHAR(64) DEFAULT 'public',
        profile_picture VARCHAR(512),
        bio TEXT,
        location VARCHAR(128),
        status VARCHAR(64) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Now create images table which references users
      CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        filename VARCHAR(256) NOT NULL,
        filepath VARCHAR(512) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        img_url VARCHAR(512),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE
      );

      -- Create communities table
      CREATE TABLE IF NOT EXISTS communities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(128) UNIQUE NOT NULL,
        description TEXT,
        admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_by UUID REFERENCES users(id) ON DELETE CASCADE,
        visibility VARCHAR(64) DEFAULT 'public',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create community_members table
      CREATE TABLE IF NOT EXISTS community_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(64) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create posts table
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        img_id UUID REFERENCES images(id) ON DELETE CASCADE,
        img_url VARCHAR(512),
        community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        title VARCHAR(255),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create comments table
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        comment VARCHAR(255),
        created_by UUID REFERENCES users(id) ON DELETE CASCADE,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create messages table
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
        group_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create direct_messages table
      CREATE TABLE IF NOT EXISTS direct_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create group_messages table
      CREATE TABLE IF NOT EXISTS group_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        group_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(SQL);
    console.log("✅ Tables created successfully!");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
};

module.exports = { createTables };
