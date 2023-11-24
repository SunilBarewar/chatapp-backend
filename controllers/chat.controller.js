const asyncHandler = require("express-async-handler");
const ChatMemberModel = require("../models/ChatMember.model");
const { Op } = require("sequelize");
const { sequelize } = require("../utils/db-config");
const ChatModel = require("../models/Chat.model");

const createOneOnOneChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  
  const existingChat = await ChatMemberModel.findOne({
    attributes: ["chatID"],
    where: {
      [Op.and]: [
        { userID: { [Op.in]: [userId, req.user.id] } },
        { chatType: "single" },
      ],
    },
    group: "chatID",
    having: sequelize.literal("COUNT(DISTINCT userID) = 2"), // Ensure there are exactly two users in the chat
  });
  
  if (existingChat) {
    return res.status(200).json({ existingChat });
  }

  // Create a new chat
  const newChat = await ChatModel.create({
    isGroupChat: false,
    chatName: "chat",
  });

  // Add users to the new chat
  await ChatMemberModel.bulkCreate([
    { userID: userId, chatID: newChat.id, chatType: "single" },
    { userID: req.user.id, chatID: newChat.id, chatType: "single" },
  ]);

  return res.status(200).json({ newChat });
});

const fetchChats = asyncHandler(async (req, res) => {});

const createGroupChat = asyncHandler(async (req, res) => {});

const renameGroup = asyncHandler(async (req, res) => {});

const addToGroup = asyncHandler(async (req, res) => {});

const removeFromGroup = asyncHandler(async (req, res) => {});

module.exports = {
  fetchChats,
  createOneOnOneChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
