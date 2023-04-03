import express from "express";
// controllers
import talkController from "../controllers/talkController.js";

const router = express.Router();

router.post("/", talkController.createTalk);
router.get("/", talkController.getAllTalks);
router.delete("/:talkId", talkController.deleteById);
router.get("/:talkId/initiate-chat", talkController.initiateChat);
router.post("/:talkId/message", talkController.postMessage);
router.get("/:talkId/chats", talkController.getChatsByTalkId);
export default router;
