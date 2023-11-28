const sequelize = require("../utils/db-config");
const UserModel = require("./User.model");
const ChatModel = require("./Chat.model");
const ChatMemberModel = require("./ChatMember.model");
const MessageModel = require("./Message.model");

const connectDB = async () => {
  ChatModel.belongsToMany(UserModel, {
    through: ChatMemberModel,
    foreignKey: "chatID",
    onDelete: "CASCADE",
    as: "members", // Use a distinct alias
  });

  UserModel.belongsToMany(ChatModel, {
    through: ChatMemberModel,
    foreignKey: "userID",
    onDelete: "CASCADE",
    as: "chats",
  });

  UserModel.hasMany(MessageModel, {
    foreignKey: "senderID",
    onDelete: "CASCADE",
  });

  MessageModel.belongsTo(UserModel, {
    foreignKey: "senderID",
  });

  ChatModel.hasMany(MessageModel, {
    foreignKey: "chatID",
    onDelete: "CASCADE",
    as: "chatMessages",
  });

  MessageModel.belongsTo(ChatModel, {
    foreignKey: "chatID",
  });

  MessageModel.hasOne(ChatModel, {
    foreignKey: "latestMessageID",
    onDelete: "CASCADE",
    as: "latestMessage",
  });

  ChatModel.belongsTo(MessageModel, {
    foreignKey: "latestMessageID",
    as: "latestMessage",
  });

  UserModel.hasOne(ChatModel, {
    foreignKey: "groupAdminID",
    onDelete: "CASCADE",
    as: "groupAdmin",
  });

  ChatModel.belongsTo(UserModel, {
    foreignKey: "groupAdminID",
    as: "groupAdmin",
  });

  await sequelize.sync({});
};

module.exports = connectDB;
