import { Request, Response } from "express";
import UserService from "../services/UserService";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, dateOfBirth, gender } = req.body;

    if (!email || !password || !username || !dateOfBirth || !gender) {
      res.status(400).json({
        status: "Error",
        message: "Missing required fields",
      });
      return;
    }

    if (!dateOfBirth.day || !dateOfBirth.month || !dateOfBirth.year) {
      res.status(400).json({
        status: "Error",
        message: "Invalid date of birth format",
      });
      return;
    }

    const validGenders = [
      "man",
      "woman",
      "non-binary",
      "something-else",
      "prefer-not-to-say",
    ];
    if (!validGenders.includes(gender)) {
      res.status(400).json({
        status: "Error",
        message: "Invalid gender value",
      });
      return;
    }

    const result = await UserService.register({
      email,
      password,
      username,
      dateOfBirth,
      gender,
    });

    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      status: "Error",
      message: error.message,
    });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        status: "Error",
        message: "Email/Username and password are required",
      });
      return;
    }

    const result = await UserService.login(identifier, password);

    res.status(200).json({
      status: "Success",
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      status: "Error",
      message: error.message,
    });
  }
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({
        status: "Error",
        message: "Refresh token is required",
      });
      return;
    }

    const result = await UserService.refreshToken(token);

    res.status(200).json({
      status: "Success",
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      status: "Error",
      message: error.message,
    });
  }
};

const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as any)?._id;
    const { name, desc } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      res.status(400).json({ error: "Missing image file" });
      return;
    }

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const playlist = await UserService.createPlaylist({
      name,
      desc,
      owner: userId,
      image: imageUpload.secure_url,
      songs: [],
    });

    res.status(201).json(playlist);
  } catch (error: any) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ message: "Failed to create playlist", error: error.message });
  }
};

const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ status: "Error", message: "Invalid or missing userId" });
      return;
    }

    const updatedUser = await UserService.updateUserRole(userId, newRole);

    res.status(200).json({
      status: "Success",
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update user role error:", error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      status: "Error",
      message: error.message,
    });
  }
};

const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserService.listUsers();

    res.status(200).json({
      status: "Success",
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (error: any) {
    console.error("List users error:", error);
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      status: "Error",
      message: error.message,
    });
  }
};

export default {
  register,
  login,
  refreshToken,
  createPlaylist,
  updateRole,
  listUsers,
};
