const { Sequelize } = require("sequelize");
const makeAssociations = require("./makeAssociations");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
  }
);

async function connectDB() {
  await sequelize.sync({ force: true });
}
module.exports = {
  sequelize,
  connectDB,
};
