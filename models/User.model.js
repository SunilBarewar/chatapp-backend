const { DataTypes } = require("sequelize");

const { sequelize } = require("../utils/db-config");

const UserModel = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePic: {
    type: DataTypes.STRING,
    defaultValue: "https://i.pravatar.cc/200",
  },
});

module.exports = UserModel;
