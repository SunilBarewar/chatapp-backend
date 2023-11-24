const { DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db-config");

// Define the ChatMembers model
const ChatMemberModel = sequelize.define(
  "chatmember",
  {
    chatID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "chats",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    // chatType can be "group", "single"
    chatType: {
      type: DataTypes.STRING,
      defaultValue: "single",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ChatMemberModel;
