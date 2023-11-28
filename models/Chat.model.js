const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db-config");

const ChatModel = sequelize.define(
  "chat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    chatName: {
      type: DataTypes.STRING,
      defaultValue: "chat",
    },
  },
  {
    hooks: {
      beforeCreate: (chat, options) => {
        // Set groupAdmin to NULL for one-on-one chats
        if (!chat.isGroupChat) {
          chat.groupAdmin = null;
        }

        // Set latestMessage to NULL for a new chat
        chat.latestMessage = null;
      },
    },
  }
);

module.exports = ChatModel;
