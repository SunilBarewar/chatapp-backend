const express = require("express");
const {
  allMessages,
  sendMessage,
  saveImageMessage,
} = require("../controllers/message.controller");
const protect = require("../middleware/auth");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/upload").post(protect, saveImageMessage);

module.exports = router;
