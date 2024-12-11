import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    nationalId: {
      type: String,
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    workingHours: {
      start: {
        type: String,
        required: true,
      },
      end: {
        type: String,
        required: true,
      },
      daysOff: [{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      }],
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.model("Doctor", doctorSchema);