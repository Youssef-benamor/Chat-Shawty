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

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

// Protect this route so req.user is defined
router.put("/profile", upload.single("profilePicture"), updateProfile);

export default router;
