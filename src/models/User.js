import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
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
export default model("users", userSchema);
