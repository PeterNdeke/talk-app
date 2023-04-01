import http from "http";
import express from "express";
import logger from "morgan";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import socketio from "socket.io";

import "./config/database.js";
import WebSockets from "./utils/WebSockets.js";
// routes
import userRouter from "./routes/user.js";
import indexRouter from "./routes/index.js";
import talkRouter from "./routes/talk.js";
import attendeeRouter from "./routes/attendee.js";

// middlewares
import { decode } from "./middlewares/jwt.js";

const app = express();

/** Get port from environment and store in Express. */
const port = process.env.PORT || "3000";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/", indexRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/talk", decode, talkRouter);
app.use("/api/v1/attendee", decode, attendeeRouter);

/** catch 404 and forward to error handler */
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

/** Create HTTP server. */
const server = http.createServer(app);
/** Create socket connection */
global.io = socketio.listen(server);
global.io.on("connection", WebSockets.connection);
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
