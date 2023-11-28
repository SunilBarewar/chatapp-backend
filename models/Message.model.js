const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db-config");

const MessageModel = sequelize.define(
  "message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
