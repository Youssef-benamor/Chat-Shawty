import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  findUser,
  getUsers,
  updateProfile,
} from "../controllers/userController.js";

import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js"; // <-- import protect

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

// Protect this route by adding the middleware before updateProfile
router.put("/profile", protect, upload.single("profilePicture"), updateProfile);

export default router;
