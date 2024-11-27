import { Router } from "express";
import { createAdministrator } from "../../controllers/administrator/administrator.ctrl";

const router = Router();

router.post("/administrator", createAdministrator);

export default router;