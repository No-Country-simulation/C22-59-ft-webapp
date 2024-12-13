import mongoose from "mongoose";
import {Response} from "express";
import {HttpResponse} from "@helpers/error/validation.error";

const MONGO_URL = process.env.MONGO_URI as string;
const httpResponse = new HttpResponse();

mongoose.Promise = Promise;

const initDB = async (res?: Response): Promise<void> => {
	try {
		await mongoose.connect(MONGO_URL);
		console.log("Connected to DB.");
		const db = mongoose.connection;
		db.on("error", console.error.bind(console, "connection error:"));
		const dbname = db.name;
		console.log("DB Name: ", dbname);
		if (res) httpResponse.Ok(res, "Connected to DB.");
	} catch (error: any) {
		console.log("Error connecting to DB");
		if (res) httpResponse.Ok(res, "Error connecting to DB.");
	}
};

export default initDB;
