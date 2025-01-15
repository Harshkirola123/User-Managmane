import { Router } from "express";
import {
  createUser,
  toggleUserBlock,
  login,
  getUserAnalytics,
  getPendingUsers,
} from "./admin.controller";
import authenticateJWT from "../utilis/middleware";

const router = Router();

router.post(
  "/create-user",
  (req, res, next) => {
    console.log("Hello");
    next();
  },
  authenticateJWT,
  createUser
);
router.post("/toggle-block", authenticateJWT, toggleUserBlock);
router.get("/userAnalytics", authenticateJWT, getUserAnalytics);
router.post("/login", login);
router.get("/pendingUser", authenticateJWT, getPendingUsers);
export default router;
