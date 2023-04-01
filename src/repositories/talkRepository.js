import Talk from "../models/Talk.js";
import { BaseRepository } from "./baseRepository.js";

class TalkRepository extends BaseRepository {
  constructor() {
    super(Talk);
  }

  async initiateChat(userIds) {
    try {
      const availableRoom = await this.findOne({
        userIds: {
          $size: userIds.length,
          $all: [...userIds],
        },
      });
      console.log(availableRoom);
      if (availableRoom) {
        return {
          isNew: false,
          message: "retrieving an old chat room",
          talkId: availableRoom._id,
        };
      }
      throw "No Attendee added to this talk yet";
    } catch (error) {
      console.log("error on start chat method", error);
      throw error;
    }
  }
}

export default new TalkRepository();
