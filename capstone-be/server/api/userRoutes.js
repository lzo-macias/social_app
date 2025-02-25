const express = require("express");
const router = express.Router();

const app = express();
const cors = require("cors");
require("dotenv").config();

const { client } = require("pg");

// const client = new Client();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
// app.use("/api", require("./server/api"));
// const {
//   client
// } = require("../../app");
const {
  createUser,
  fetchUsers,
  updateUser,
  authenticate,
  findUserByToken,
  isLoggedIn,
  register
} = require("../db/users");

router.post("/users/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await register({ username, password });
    res.status(201).send(token);
  } catch (ex) {
    next(ex);
  }
});

router.post("/users/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log("Attempting login with username:", username);
    res.send(await authenticate({ username, password }));
  } catch (ex) {
    next(ex);
  }
});


router.get("/myprofile", async (req, res, next) => {
  try {
    res.send(await findUserByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

router.put("/users/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      is_admin,
      username,
      password,
      email,
      dob,
      visibility,
      profile_picture,
      bio,
      location,
      status,
    } = req.body;
    const user = req.user;

    const result = await updateUser(
      is_admin,
      username,
      password,
      email,
      dob,
      visibility,
      profile_picture,
      bio,
      location,
      status
    );
    console.log("Profile updated!");
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});
const init = async () => {
  try {
    console.log("connecting to client");
    await client.connect();
    app.use("api", router);
    app.listen(PORT, () => {
      console.log(`server live on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

init();
module.exports = router;
