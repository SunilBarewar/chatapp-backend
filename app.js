const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cron = require("node-cron");
const { Redis } = require("ioredis");
const { createAdapter } = require("@socket.io/redis-adapter");
dotenv.config();

const connectDB = require("./models");
const { errorHandler, notFound } = require("./middleware/error");
const Routes = require("./routes");
const sockets = require("./socket/sockets");

// const archieveOldMessages = require("./controllers/archievedMessages.controller");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(helmet());

const PORT = process.env.PORT || 5000;

app.use("/api", Routes);
app.get("/", (req, res) => {
  res.status(200).json({ message: "chat app backend" });
});

// Error Handling middlewares
app.use(notFound);

app.use(errorHandler);

connectDB();
const server = app.listen(PORT, () =>
  console.log(`server running at PORT:${PORT} successfully`)
);

const redis = require("redis");
const redisUri = process.env.REDIS_URI;
const publisher = redis.createClient({
  url: redisUri,
});
const subscriber = publisher.duplicate();

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // credentials: true,
  },
});

// io.adapter(createAdapter(pubClient, subClient));
const constants = {
  CHANNAL_NAME: "messages",
};

io.on("connection", async (socket) => {
  // console.log("connected");
  socket.on("join chat", (room) => {
    socket.leaveAll();
    // console.log("joined room: ", room);
    socket.join(room);
  });

  socket.on("new.message", async (message) => {
    // console.log("new message : ", message);
    await publisher.publish(constants.CHANNAL_NAME, JSON.stringify(message));
  });
});

(async () => {
  await publisher.connect();
  await subscriber.connect();

  await subscriber.subscribe(constants.CHANNAL_NAME, (message) => {
    const parsedMessage = JSON.parse(message);
    io.in(parsedMessage.chatID).emit("new.message", parsedMessage);
  });
})();

// cron.schedule("0 0 * * *", async () => {
//   await archieveOldMessages();
// });
