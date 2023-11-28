const UserModel = require("../models/User.model");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../utils/generateAccessToken");
const { Op } = require("sequelize");

/**
 *
 *@description     register new user
 *@route           POST /api/user/register
 *@access          Public
 */
exports.registerUser = asyncHandler(async (req, res, next) => {
  const saltRounds = 10;
  const { email, password } = req.body;
  let user = await UserModel.findOne({ where: { email: email } });

  if (user) {
    return res.status(409).json({ message: "user already exits" });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  user = await UserModel.create({ ...req.body, password: hashedPassword });
  const { id, profilePic, name } = user;
  const token = generateAccessToken({
    userId: user.id,
  });

  return res.status(200).json({
    token,
    id,
    profilePic,
    name,
  });
});

/**
 *
 *@description     login user
 *@route           POST /api/user/login
 *@access          Public
 */
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;
  const user = await UserModel.findOne({
    where: {
      email,
    },
  });

  // user does not found
  if (!user) return res.status(404).json({ message: "email does not exists!" });

  const match = await bcrypt.compare(password, user.password);

  // password didn't matched
  if (!match) return res.status(401).json({ message: "wrong password" });

  const { id, profilePic, name } = user;
  const token = generateAccessToken({
    userId: user.id,
  });

  return res.status(200).json({
    token,
    id,
    profilePic,
    name,
  });
});

/**
 *
 *@description     get all users
 *@route           POST /api/user/
 *@access          Protected
 */

exports.allUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const keyword = search
    ? {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      }
    : {};

  const users = await UserModel.findAll({
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
    where: {
      ...keyword,
      id: {
        [Op.ne]: req.user.id,
      },
    },
  });

  res.status(200).json(users);
});
