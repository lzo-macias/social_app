const express = require("express");
const router = express.Router();
const app = express();
require("dotenv").config();
const { Pool } = require("pg");

const { createTables } = require("../db/db");
const { createUser, fetchUsers } = require("../db/users");




module.exports = router;
