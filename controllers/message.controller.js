const asyncHandler = require("express-async-handler");
const MessageModel = require("../models/Message.model");
const ChatModel = require("../models/Chat.model");
const uploadToS3 = require("../utils/uploadToS3");
const shortid = require("shortid");

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
  const { content, contentType, chatID } = req.body;
  const { id } = req.user;

  const message = await MessageModel.create({
    content,
    contentType,
    chatID: chatID,
    senderID: id,
  });

  await ChatModel.update(
    { latestMessageID: message.id },
    {
      where: {
        id: chatID,
      },
    }
  );
  res.status(200).json(message);
});

const saveImageMessage = asyncHandler(async (req, res) => {
  const { chatId, extension, fileType, image } = req.body;
  const { id } = req.user;
  const filename = `message-${shortid.generate()}.${extension}`;
  const params = {
    Key: filename,
    Bucket: process.env.S3_BUCKET_NAME,
    Body: new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    ),
    ACL: "public-read",
    ContentType: fileType,
  };

  try {
    const imageData = await uploadToS3(params);
    const message = await MessageModel.create({
      content: imageData.Location,
      contentType: "image",
      chatID: chatId,
      senderID: id,
    });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to upload" });
  }
});

module.exports = {
  allMessages,
  sendMessage,
  saveImageMessage,
};
