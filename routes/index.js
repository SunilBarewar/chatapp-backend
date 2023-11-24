const router = require("express").Router();
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");

router.use("/user", userRoutes);
router.use("/chat", chatRoutes);

module.exports = router;
