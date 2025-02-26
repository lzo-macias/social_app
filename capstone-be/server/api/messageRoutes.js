const express = require("express");
const { sendDirectMessage, sendGroupMessage, fetchDirectMessages, fetchGroupMessages } = require("../db/message");

const router = express.Router();
router.use(express.json());

// **Send a Direct Message**
router.post("/messages/direct", async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body;
    const message = await sendDirectMessage({ senderId: sender_id, receiverId: receiver_id, content });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send direct message" });
  }
});

// **Send a Group Message**
router.post("/messages/group", async (req, res) => {
  try {
    const { sender_id, group_id, content } = req.body;
    const message = await sendGroupMessage({ senderId: sender_id, groupId: group_id, content });
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send group message" });
  }
});

// **Get Direct Messages**
router.get("/messages/direct/:sender_id/:receiver_id", async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;
    const messages = await fetchDirectMessages(sender_id, receiver_id);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch direct messages" });
  }
});

// **Get Group Messages**
router.get("/messages/group/:group_id", async (req, res) => {
  try {
    const { group_id } = req.params;
    const messages = await fetchGroupMessages(group_id);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch group messages" });
  }
});

module.exports = router;
