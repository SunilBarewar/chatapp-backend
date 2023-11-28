const router = require("express").Router();
const userRoutes = require("./user.route");
const chatRoutes = require("./chat.route");
const messageRoutes = require("./message.route");

router.use("/user", userRoutes);

router.use("/chat", chatRoutes);

router.use("/message", messageRoutes);
module.exports = router;
