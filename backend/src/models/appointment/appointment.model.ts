import mongoose from "mongoose";
import moment from "moment-timezone";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    reason: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    createdAt: {
      type: String,
      default: moment().tz("America/Bogota").format(),
    },
    updatedAt: {
      type: String,
      default: moment().tz("America/Bogota").format(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);