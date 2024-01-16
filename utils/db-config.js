const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: process.env.DB_PORT,
    dialect: "mysql",
    host: process.env.DB_HOST,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(path.join(__dirname, "../ca.pem")).toString(),
      },
    },
  }
);

module.exports = sequelize;
