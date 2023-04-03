import makeValidation from "@withvoid/make-validation";
import ChatMessage from "../models/ChatMessage.js";
import chatMessageRepository from "../repositories/chatMessageRepository.js";
import TalkRepository from "../repositories/talkRepository.js";
import userRepository from "../repositories/userRepository.js";
import loggingService from "../utils/loggingService.js";
export default {
  createTalk: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          subject: { type: types.string },
          description: { type: types.string },
        },
      }));
      if (!validation.success) return res.status(400).json({ ...validation });
      const payload = {
        ...req.body,
        user_id: req.userId,
        attendee_id: null,
      };
      loggingService.info(payload);
      const talk = await TalkRepository.create(payload);
      return res.status(200).json({ success: true, talk });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },

  getAllTalks: async (req, res) => {
    try {
      const talks = await TalkRepository.all();
      return res.status(200).json({ success: true, talks });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  deleteById: async (req, res) => {
    try {
      const { talkId } = req.params;
      console.log(talkId);
      await TalkRepository.delete({ id: talkId });
      return res.status(200).json({ success: true, data: "deleted" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  initiateChat: async (req, res) => {
    try {
      const { talkId } = req.params;
      const talk = await TalkRepository.findById(talkId);

      const allUserIds = talk.userIds;

      const data = await TalkRepository.initiateChat(allUserIds);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  postMessage: async (req, res) => {
    try {
      const { talkId } = req.params;
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          messageText: { type: types.string },
        },
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const messagePayload = {
        messageText: req.body.messageText,
      };
      const currentLoggedUser = req.userId;
      console.log(talkId, messagePayload, currentLoggedUser);
      const post = await chatMessageRepository.createChatMessage(
        talkId,
        messagePayload,
        currentLoggedUser
      );
      global.io.sockets.in(talkId).emit("new message", { message: post });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getChatsByTalkId: async (req, res) => {
    try {
      const { talkId } = req.params;
      const talk = await TalkRepository.findById(talkId);
      if (!talk) {
        return res.status(400).json({
          success: false,
          message: "No talk exists for this id",
        });
      }
      const users = await userRepository.getUserByIds(talk.userIds);
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const chats = await chatMessageRepository.getChatsByTalkId(
        talkId,
        options
      );
      return res.status(200).json({
        success: true,
        chats,
        users,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
};
