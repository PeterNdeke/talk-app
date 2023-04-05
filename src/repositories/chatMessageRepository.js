import ChatMessage from "../models/ChatMessage.js";
import { BaseRepository } from "./baseRepository.js";

class ChatMessageRepository extends BaseRepository {
  constructor() {
    super(ChatMessage);
  }

  async createChatMessage(talk_id, message, postedByUser) {
    try {
      const post = await this.create({
        talk_id,
        message,
        postedByUser,
        readByRecipients: { readByUserId: postedByUser },
      });

      const aggregate = await this.aggregate([
        // get post where _id = post._id
        { $match: { _id: post._id } },
        // do a join on another table called users, and
        // get me a user whose _id = postedByUser
        {
          $lookup: {
            from: "users",
            localField: "postedByUser",
            foreignField: "_id",
            as: "postedByUser",
          },
        },
        { $unwind: "$postedByUser" },
        // do a join on another table called chatrooms, and
        // get me a chatroom whose _id = chatRoomId
        {
          $lookup: {
            from: "talks",
            localField: "talk_id",
            foreignField: "_id",
            as: "talkInfo",
          },
        },
        { $unwind: "$talkInfo" },
        { $unwind: "$talkInfo.userIds" },
        // do a join on another table called users, and
        // get me a user whose _id = userIds
        {
          $lookup: {
            from: "users",
            localField: "talkInfo.userIds",
            foreignField: "_id",
            as: "talkInfo.userProfile",
          },
        },
        { $unwind: "$talkInfo.userProfile" },
        // group data
        {
          $group: {
            _id: "$talkInfo._id",
            postId: { $last: "$_id" },
            talkId: { $last: "$talkInfo._id" },
            message: { $last: "$message" },
            postedByUser: { $last: "$postedByUser" },
            readByRecipients: { $last: "$readByRecipients" },
            talkInfo: { $addToSet: "$talkInfo.userProfile" },
            createdAt: { $last: "$createdAt" },
            updatedAt: { $last: "$updatedAt" },
          },
        },
      ]);
      console.log(aggregate[0]);
      return aggregate[0];
    } catch (error) {
      throw error;
    }
  }

  async getChatsByTalkId(talk_id, options = {}) {
    try {
      return this.aggregate([
        { $match: { talk_id } },
        { $sort: { createdAt: -1 } },
        // do a join on another table called users, and
        // get me a user whose _id = postedByUser
        {
          $lookup: {
            from: "users",
            localField: "postedByUser",
            foreignField: "_id",
            as: "postedByUser",
          },
        },
        { $unwind: "$postedByUser" },
        // apply pagination
        { $skip: options.page * options.limit },
        { $limit: options.limit },
        { $sort: { createdAt: 1 } },
      ]);
    } catch (error) {
      throw error;
    }
  }
}

export default new ChatMessageRepository();
