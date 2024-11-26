import { Router } from "express";
import { createUser } from "../../controllers/users/user.ctrl";
import { loginUser } from "../../controllers/users/user.ctrl";


const router = Router();

router.post("/users/auth/register", createUser);
router.post("/users/auth/login", loginUser);

export default router;
