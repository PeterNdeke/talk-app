import express from "express";
// controllers
import attendeeController from "../controllers/attendeeController.js";

const router = express.Router();

router.post("/", attendeeController.createAttendee);
router.post("/to-talk", attendeeController.addAttendeeToTalk);
router.get("/:talk_id/all", attendeeController.getAllAttendeeForAtalk);

export default router;
