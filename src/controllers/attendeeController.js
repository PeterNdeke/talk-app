import makeValidation from "@withvoid/make-validation";
import AttendeeRepository from "../repositories/attendeeRepository.js";
import TalkRepository from "../repositories/talkRepository.js";
import loggingService from "../utils/loggingService.js";
export default {
  createAttendee: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          user_id: { type: types.string },
          talk_id: { type: types.string },
        },
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { user_id, talk_id } = req.body;
      const talk = await TalkRepository.findById(talk_id);
      if (!talk) {
        throw "Talk did not exist";
      }
      const attendeeExist = await AttendeeRepository.findOne({
        user_id,
        talk_id,
      });
      if (attendeeExist?.id) {
        throw `Attendee with ${attendeeExist.user_id} already exist in the talk`;
      }
      const attendee = await AttendeeRepository.create(req.body);

      await TalkRepository.upsert(
        { _id: talk.id },
        { $push: { userIds: attendee.user_id } }
      );
      return res.status(200).json({ success: true, attendee });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },

  addAttendeeToTalk: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          talk_id: { type: types.string },
          attendee_id: { type: types.string },
        },
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { talk_id, attendee_id } = req.body;
      const attendeeToTalk = await TalkRepository.upsert(
        { _id: talk_id },
        { attendee_id }
      );

      return res.status(200).json({ success: true, attendeeToTalk });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  getAllAttendeeForAtalk: async (req, res) => {
    try {
      const { talk_id } = req.params;

      const talks = await AttendeeRepository.find({ talk_id });
      return res.status(200).json({ success: true, talks });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
};
