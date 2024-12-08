import mongoose from "mongoose";

const administratorSchema = new mongoose.Schema({
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
		minlength: 8,
	},
	telephone: {
		type: String,
		required: true,
	}
});
export default mongoose.model("Administrator", administratorSchema);