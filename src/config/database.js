import mongoose from "mongoose";
import loggingService from "../utils/loggingService.js";
import config from "./index.js";
mongoose.set("debug", true);
const mongodbUrl = `${config.db.MONGODB_URL}/${config.db.DB_NAME}?retryWrites=true&w=majority`;

loggingService.info("MONGO_DB_FULL_URL", mongodbUrl);
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("connected", () => {
  console.log("DATABASE CONNECTED");
});

db.on("error", (error) => {
  console.error("An error occurred", JSON.stringify(error));
  loggingService.error(
    error.message,
    new Error(error.message).stack,
    { mongodbUrl },
    true
  );
  process.exit(1);
});

process.on("SIGINT", function () {
  db.close();
  console.log("DATABASE DISCONNECTED");
  process.exit(1);
});

global.db = db;
