const { DataTypes } = require("sequelize");

const sequelize = require("../utils/db-config");

// Define the ChatMembers model
const ChatMemberModel = sequelize.define(
  "chatmember",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    isGroupMember: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Default to true for group members
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ChatMemberModel;
