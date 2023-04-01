import ChatMessage from "../models/ChatMessage.js";
import { BaseRepository } from "./baseRepository.js";

class ChatMessageRepository extends BaseRepository {
  constructor() {
    super(ChatMessage);
  }

  async createChatMessage(chatRoomId, message, postedByUser) {
    const post = await this.create({
      chatRoomId,
      message,
      postedByUser,
      readByRecipients: { readByUserId: postedByUser },
    });
    //console.log("post", post);
    const aggregate = await this.aggregate([
      // get post where _id = post._id
      { $match: { _id: post._id } },
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: "users",
          localField: "postedByUser",
          foreignField: "id",
          as: "postedByUser",
        },
      },
      { $unwind: "$postedByUser" },
      // do a join on another table called talks, and
      // get me a talk whose _id = talk_id
      {
        $lookup: {
          from: "talks",
          localField: "talk_id",
          foreignField: "id",
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
          foreignField: "id",
          as: "talkInfo.userProfile",
        },
      },
      { $unwind: "$talkInfo.userProfile" },
      // group data
      {
        $group: {
          _id: "$talkInfo._id",
          postId: { $last: "$_id" },
          talkId: { $last: "$talkInfo.id" },
          message: { $last: "$message" },
          postedByUser: { $last: "$postedByUser" },
          readByRecipients: { $last: "$readByRecipients" },
          talkInfo: { $addToSet: "$talkInfo.userProfile" },
          createdAt: { $last: "$createdAt" },
          updatedAt: { $last: "$updatedAt" },
        },
      },
    ]);
    console.log(aggregate);
    return aggregate[0];
  }
}

export default new ChatMessageRepository();
