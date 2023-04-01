import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const MESSAGE_TYPES = {
  TYPE_TEXT: "text",
};

const readByRecipientSchema = new Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const chatMessageSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    talk_id: String,
    message: Schema.Types.Mixed,
    type: {
      type: String,
      default: () => MESSAGE_TYPES.TYPE_TEXT,
    },
    postedByUser: String,
    readByRecipients: [readByRecipientSchema],
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.statics.createPostInChatRoom = async function (
  chatRoomId,
  message,
  postedByUser
) {
  try {
    const post = await this.create({
      chatRoomId,
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
      //   // do a join on another table called chatrooms, and
      //   // get me a chatroom whose _id = chatRoomId
      //   {
      //     $lookup: {
      //       from: "talks",
      //       localField: "talk_id",
      //       foreignField: "_id",
      //       as: "talkInfo",
      //     },
      //   },
      //   { $unwind: "$talkInfo" },
      //   { $unwind: "$talkInfo.userIds" },
      //   // do a join on another table called users, and
      //   // get me a user whose _id = userIds
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "talkInfo.userIds",
      //       foreignField: "_id",
      //       as: "talkInfo.userProfile",
      //     },
      //   },
      //   { $unwind: "$talkInfo.userProfile" },
      //   // group data
      //   {
      //     $group: {
      //       _id: "$talkInfo._id",
      //       postId: { $last: "$_id" },
      //       chatRoomId: { $last: "$talkInfo._id" },
      //       message: { $last: "$message" },
      //       postedByUser: { $last: "$postedByUser" },
      //       readByRecipients: { $last: "$readByRecipients" },
      //       chatRoomInfo: { $addToSet: "$talkInfo.userProfile" },
      //       createdAt: { $last: "$createdAt" },
      //       updatedAt: { $last: "$updatedAt" },
      //     },
      //   },
    ]);
    console.log(aggregate[0]);
    return aggregate[0];
  } catch (error) {
    throw error;
  }
};

export default model("chat-messages", chatMessageSchema);
