import { Router } from "express";
import { createUser } from "../../controllers/users/user.ctrl";

const router = Router();

router.post("/users", createUser);

export default router;
