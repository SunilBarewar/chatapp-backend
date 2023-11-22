const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();

const { connectDB } = require("./utils/db-config");
const { errorHandler, notFound } = require("./middleware/error");
const Routes = require("./routes");
const UserModel = require("./models/User.model");

connectDB();
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

const server = app.listen(PORT, () =>
  console.log(`server running at PORT:${PORT} successfully`)
);
