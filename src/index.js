import http from "http";
import express from "express";
import logger from "morgan";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import "./config/database.js";
// routes
import userRouter from "./routes/user.js";
import indexRouter from "./routes/index.js";

const app = express();

/** Get port from environment and store in Express. */
const port = process.env.PORT || "3000";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/", indexRouter);
app.use("/api/v1/users", userRouter);

/** catch 404 and forward to error handler */
app.use("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint doesnt exist",
  });
});

/** Create HTTP server. */
const server = http.createServer(app);
/** Listen on provided port, on all network interfaces. */
server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});
