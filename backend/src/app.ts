import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import swaggerDocs from "./docs/swagger";
import initDB from "@db/db";
import userRoutes from "@routes/user/user.routes";
import appointmentRoutes from "@routes/appointment/appointment.routes";

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

app.use("/api/users", userRoutes);
app.use('/api/appointments', appointmentRoutes);

app.listen(PORT, (): void => {
  swaggerDocs(app);
  console.log(`Server running on port ${PORT}`);
});

initDB();
