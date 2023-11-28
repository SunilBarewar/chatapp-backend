const asyncHandler = require("express-async-handler");
const ChatMemberModel = require("../models/ChatMember.model");
const { Op} = require("sequelize");
const sequelize = require("../utils/db-config");
const ChatModel = require("../models/Chat.model");
const UserModel = require("../models/User.model");
const MessageModel = require("../models/Message.model");

const createOneOnOneChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.user;
  const existingChat = await ChatMemberModel.findOne({
    attributes: ["chatID"],
    where: {
      userID: {
        [Op.in]: [userId, id],
      },
      isGroupMember: false,
    },
    group: ["chatID"],
    having: sequelize.literal("COUNT(DISTINCT `userID`) = 2"),
  });
  let chatId, createdChat;

  if (!existingChat) {
    const newChat = await ChatModel.create({
      isGroupChat: false,
      chatName: "chat",
    });
    chatId = newChat.id;
    createdChat = true;
    // Add users to the new chat
    await ChatMemberModel.bulkCreate([
      { userID: userId, chatID: newChat.id, isGroupMember: false },
      { userID: id, chatID: newChat.id, isGroupMember: false },
    ]);
  } else {
    chatId = existingChat.chatID;
    createdChat = false;
  }

  const chat = await ChatModel.findByPk(chatId, {
    include: [
      {
        model: UserModel,
        as: "members",
        attributes: ["id", "name", "email", "profilePic"],
        through: {
          model: ChatMemberModel,
          attributes: [],
        },
      },
    ],
  });
  return res.status(200).json({ chat, createdChat });
});

const fetchChats = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const result = await ChatModel.findAll({
    where: {
      id: {
        [Op.in]: sequelize.literal(
          `(SELECT chatID FROM chatmembers WHERE userID = ${id})`
        ),
      },
    },
    include: [
      {
        model: UserModel,
        as: "members",
        attributes: ["id", "name", "email", "profilePic"],
        through: { model: ChatMemberModel, attributes: [] },
      },
      {
        model: MessageModel,
        as: "latestMessage",
      },
    ],
    order: [["updatedAt", "DESC"]],
  });
  res.status(200).json(result);
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { groupName, groupMembers } = req.body;
  const { id } = req.user;
  const t = await sequelize.transaction();
  try {
    const newChat = await ChatModel.create(
      {
        isGroupChat: true,
        chatName: groupName,
        groupAdminID: id,
      },
      {
        transaction: t,
      }
    );

    // Add users to the new chat
    const members = groupMembers.map((user) => {
      return {
        userID: user.id,
        chatID: newChat.id,
      };
    });
    const result = await ChatMemberModel.bulkCreate(members, {
      transaction: t,
    });

    await t.commit();
    res.status(200).json({ group: newChat, members: result });
  } catch (error) {
    await t.rollback();
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, newGroupName } = req.body;

  await ChatModel.update(
    {
      chatName: newGroupName,
    },
    {
      where: {
        id: chatId,
        isGroupChat: true,
      },
    }
  );

  res.status(200).json({ message: "Group renamed successfully!" });
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    res.status(400);
    throw new Error("chatId and userId required");
  }
  const chatMember = await ChatMemberModel.findOne({
    where: {
      chatID: chatId,
      userID: userId,
    },
  });
  if (chatMember) {
    res.status(400);
    throw new Error("user is already exists in the group");
  }

  await ChatMemberModel.create({
    chatID: chatId,
    userID: userId,
  });

  res.status(200).json({ message: "user added to group" });
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { memberId } = req.body;

  await ChatMemberModel.destroy({
    where: {
      id: memberId,
      isGroupMember: true,
    },
  });
  res.status(200).json({ message: "removed user from group" });
});

module.exports = {
  fetchChats,
  createOneOnOneChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
