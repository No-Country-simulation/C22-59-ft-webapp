import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

const PORT = Number(process.env.PORT) || 4000;

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});

const MONGO_URL = 'mongodb+srv://elysiumadmin:Nsgv8iaD1S1NvEzi@elysium.2ytlt.mongodb.net/?retryWrites=true&w=majority&appName=Elysium';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error)=> console.log(error));