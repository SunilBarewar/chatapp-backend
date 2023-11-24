const UserModel = require("./User.model");
const ChatMemberModel = require("./ChatMember.model");
const ChatModel = require("./Chat.model");
const MessageModel = require("./Message.model");

const { sequelize } = require("../utils/db-config");

async function database() {
  await sequelize.sync().then(() => {
    ChatModel.hasMany(ChatMemberModel, { foreignKey: "chatID" });
    UserModel.hasMany(ChatMemberModel, { foreignKey: "userID" });
  });
}

module.exports = database;
