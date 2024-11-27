import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import swaggerDocs from "./docs/swagger";
import initDB from "../src/db/db";
import userRoutes from "../src/routes/user/user.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

const PORT = Number(process.env.PORT) || 4000;
/**
 * @swagger
 * /:
 *   get:
 *     description: Root path
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.use("/api", userRoutes);
app.listen(PORT, (): void => {
  swaggerDocs(app);
  console.log(`Server running on port ${PORT}`);
});

initDB();
