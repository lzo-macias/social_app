const { Client } = require("pg");
require("dotenv").config(); // Ensure environment variables are loaded
const { v4: uuidv4 } = require('uuid');  // Import uuid for generating UUIDs

const client = new Client();







// module.exports = { 
//   client, 
//   createTables, 
//   createUser, 
//   createCommunity, 
//   createCommunityMember, 
//   createPost, 
//   createMessage, 
//   fetchUsers,
//   fetchCommunities,
//   fetchPostsByCommunity,
//   fetchMessagesByPost,
//   fetchCommunityMembers 
// };