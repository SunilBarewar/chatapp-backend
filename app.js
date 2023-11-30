const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cron = require("node-cron");
dotenv.config();

const connectDB = require("./models");
const { errorHandler, notFound } = require("./middleware/error");
const Routes = require("./routes");
const sockets = require("./socket/sockets");

const archieveOldMessages = require("./controllers/archievedMessages.controller");

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

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on("connection", sockets);

cron.schedule("0 0 * * *", async () => {
  await archieveOldMessages();
});
