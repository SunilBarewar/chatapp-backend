const express = require("express");
const {
  createOneOnOneChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chat.controller");
const protect = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createOneOnOneChat);
router.route("/").get(protect, fetchChats);
router.route("/group/create").post(protect, createGroupChat);
router.route("/group/rename").put(protect, renameGroup);
router.route("/group/remove").put(protect, removeFromGroup);
router.route("/group/add").put(protect, addToGroup);

module.exports = router;
