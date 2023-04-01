import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const talkSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    user_id: { type: String, require: true, allowNull: false },
    attendee_id: { type: String, require: true, allowNull: true },
    subject: { type: String, require: true, allowNull: false },
    description: { type: String },
    userIds: { type: Array, allowNull: true },
    chatInitiator: { type: String, allowNull: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);
export default model("talks", talkSchema);
