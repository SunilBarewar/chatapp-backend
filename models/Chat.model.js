const { DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db-config");
const UserModel = require("./User.model");

const ChatModel = sequelize.define("chat", {
  chatID: {
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
  latestMessage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "messages",
      key: "messageID",
    },
    onDelete: "CASCADE",
  },

  groupAdmin: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

UserModel.hasMany(ChatModel, {
  foreignKey: "groupAdmin",
  onDelete: "CASCADE",
});
ChatModel.belongsTo(UserModel, {
  foreignKey: "groupAdmin",
  as: "GroupAdmin",
});
module.exports = ChatModel;
