import { Router } from "express";
import { createPassword, login } from "./user.controller";

const router = Router();

router.post("/create-password", createPassword);
router.post("/login", login);
// router.post("/set-password", se);

export default router;
