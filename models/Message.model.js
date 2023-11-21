const { DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db-config");

const MessageModel = sequelize.define(
  "message",
  {
    messageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chatID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "chats",
        key: "chatID",
      },
      onDelete: "CASCADE",
    },
    senderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    content: {
      type: DataTypes.TEXT,
    },
    contentType: {
      type: DataTypes.STRING,
      defaultValue: "text",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = MessageModel;
