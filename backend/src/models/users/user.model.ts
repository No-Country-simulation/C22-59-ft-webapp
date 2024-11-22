import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    birthday: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    nationalId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    optionalTelephone: {
      type: String,
    },
    blood: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Masculino", "Femenino", "Otro"],
      required: true,
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

export default mongoose.model("User", userSchema);
