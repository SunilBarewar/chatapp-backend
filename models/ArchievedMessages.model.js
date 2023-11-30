const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-config");

const ArchivedMessagesModel = sequelize.define(
  "archivedMessages",
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
    archivedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ArchivedMessagesModel;
