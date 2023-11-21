const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/user.controller");
const protect = require("../middleware/auth");
const router = require("express").Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(protect, allUsers);

module.exports = router;
