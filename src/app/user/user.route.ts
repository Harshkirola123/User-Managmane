import { Router } from "express";
import {
  createPassword,
  forgotPassword,
  login,
  uploadKYCPhoto,
} from "./user.controller";

const router = Router();

router.post("/create-password", createPassword);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/kyc/upload", uploadKYCPhoto);
// router.post("/set-password", se);

export default router;
