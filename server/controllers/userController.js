import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import validator from "validator";

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User with the given email already exists...");
  }

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Email must be a valid email...");
  }

  if (!validator.isStrongPassword(password)) {
    res.status(400);
    throw new Error("Password must be a strong password...");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({ _id: user._id, name, email });
  } else {
    res.status(500);
    throw new Error("Registration failed...");
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({ _id: user._id, name: user.name, email });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Logout user
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// Find user by ID
const findUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (user) {
    const profilePictureUrl = user.profilePicture
      ? `${req.protocol}://${req.get("host")}/uploads/profile_pictures/${
          user.profilePicture
        }`
      : null;

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: profilePictureUrl,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { _id } = JSON.parse(req.body.user);
  console.log(_id);
  const user = await User.findById(_id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;

  if (req.body.password) {
    if (!validator.isStrongPassword(req.body.password)) {
      res.status(400);
      throw new Error("Password must be a strong password...");
    }
    user.password = req.body.password;
  }
  if (req.file) {
    user.profilePicture = req.file.filename; // or store full path: `uploads/profile_pictures/${req.file.filename}`
  }
  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePicture: updatedUser.profilePicture || null,
  });
});

export {
  registerUser,
  loginUser,
  logoutUser,
  findUser,
  getUsers,
  updateProfile,
};
