import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const attendeeSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    user_id: { type: String, require: true, allowNull: false },
    talk_id: { type: String, require: true, allowNull: false },
    description: { type: String },
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
export default model("attendee", attendeeSchema);
