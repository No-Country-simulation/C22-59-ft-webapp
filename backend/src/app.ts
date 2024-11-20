import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import initDB from "../src/db/db";


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

initDB();


