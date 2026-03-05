import mongoose from "mongoose";

const collaboratorSchema = new mongoose.Schema(
  {
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    access: {
      type: String,
      enum: ["read", "write"],
      default: "read",
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Collaborator = mongoose.model("Collaborator", collaboratorSchema);

export default Collaborator;