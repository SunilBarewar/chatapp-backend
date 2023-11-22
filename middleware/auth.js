const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const UserModel = require("../models/User.model");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const authorizationToken = req.header("Authorization");
    const { userId } = jwt.verify(
      authorizationToken,
      process.env.JWT_SECRET_KEY
    );

    const user = await UserModel.findByPk(userId, {
      attributes: {
        exclude: ["password"],
      },
    });
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
});

module.exports = protect;
