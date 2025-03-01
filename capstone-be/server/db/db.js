const { pool } = require("./index"); // Use pool instead of client
const createTables = async () => {
  try {
    console.log("Creating tables...");
    const SQL = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS posts CASCADE;
      DROP TABLE IF EXISTS community_members CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS communities CASCADE;
      DROP TABLE IF EXISTS images CASCADE;

      CREATE TABLE images (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        filename VARCHAR(256) NOT NULL,
        filepath VARCHAR(512) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        img_url 
      );

      CREATE TABLE users (
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
      CREATE TABLE communities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(128) UNIQUE NOT NULL,
        description TEXT,
        admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_by UUID REFERENCES users(id) ON DELETE CASCADE,
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
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        img_id UUID REFERENCES images(id) ON DELETE CASCADE,
        community_id UUID REFERENCES communities(id) ON DELETE CASCADE, -- Nullable for profile posts
        title VARCHAR(255),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
        group_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE direct_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE group_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        group_id UUID REFERENCES communities(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(SQL);
    console.log(":white_check_mark: Tables created successfully!");
  } catch (err) {
    console.error(":x: Error creating tables:", err);
  }
};

module.exports = { createTables };
