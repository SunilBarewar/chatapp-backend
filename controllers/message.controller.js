const asyncHandler = require("express-async-handler");
const MessageModel = require("../models/Message.model");
const ChatModel = require("../models/Chat.model");

const allMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const messages = await MessageModel.findAll({
    where: {
      chatID: chatId,
    },
  });

  res.status(200).json(messages);
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, contentType, chatId } = req.body;
  const { id } = req.user;

  const message = await MessageModel.create({
    content,
    contentType,
    chatID: chatId,
    senderID: id,
  });

  await ChatModel.update(
    { latestMessageID: message.id },
    {
      where: {
        id: chatId,
      },
    }
  );
  res.status(200).json(message);
});

module.exports = {
  allMessages,
  sendMessage,
};
