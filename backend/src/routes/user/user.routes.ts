import { Router } from "express";
import { createUser, loginUser, getUsers, getUserById } from "../../controllers/users/user.ctrl";


const router = Router();

router.post("/users/auth/register", createUser);
router.post("/users/auth/login", loginUser);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

export default router;
