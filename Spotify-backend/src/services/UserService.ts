import User from "../models/userModel";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/authUtils";

interface RegisterData {
  email: string;
  password: string;
  username: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  gender: "man" | "woman" | "non-binary" | "something-else" | "prefer-not-to-say";
}

interface RegisterResult {
  user: any;
  accessToken: string;
  refreshToken: string;
}

interface CustomError extends Error {
  status?: number;
}

const register = async (userData: RegisterData): Promise<RegisterResult> => {
  const { email, password, username, dateOfBirth, gender } = userData;

  if (!email || !password || !username || !dateOfBirth || !gender) {
    const error: CustomError = new Error("Missing required fields");
    error.status = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error: CustomError = new Error("Email already exists");
    error.status = 409;
    throw error;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    email,
    password: hashedPassword,
    username,
    dateOfBirth: {
      day: dateOfBirth.day,
      month: dateOfBirth.month,
      year: dateOfBirth.year,
    },
    gender,
  });

  await newUser.save();

  const { accessToken, refreshToken } = generateTokens(newUser);

  newUser.refreshToken = refreshToken;
  await newUser.save();

  const userObject = newUser.toObject() as any;
  delete userObject.password;
  delete userObject.refreshToken;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

const login = async (identifier: string, password: string): Promise<RegisterResult> => {
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select("+password");

  if (!user) {
    const error: CustomError = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error: CustomError = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await user.save();

  const userObject = user.toObject() as any;
  delete userObject.password;
  delete userObject.refreshToken;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await User.findOne({ refreshToken: token });

  if (!user) {
    const error: CustomError = new Error("Invalid refresh token");
    error.status = 401;
    throw error;
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    refreshToken,
  };
};

interface PlaylistData {
  name: string;
  desc: string;
  owner: string;
  image: string;
  songs?: string[];
}

const createPlaylist = async (playlistData: PlaylistData) => {
  try {
    const { name, desc, owner, image, songs } = playlistData;

    return {
      name,
      desc,
      owner,
      image,
      songs: songs || [],
    };
  } catch (error) {
    console.error("Error creating playlist in service:", error);
    throw error;
  }
};

const updateUserRole = async (userId: string, newRole: string) => {
  try {
    const validRoles = ["user", "admin"];
    if (!validRoles.includes(newRole)) {
      const error: CustomError = new Error("Invalid role specified");
      error.status = 400;
      throw error;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

    if (!updatedUser) {
      const error: CustomError = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const userObject = updatedUser.toObject() as any;
    delete userObject.password;
    delete userObject.refreshToken;

    return userObject;
  } catch (error) {
    console.error("Error updating user role in service:", error);
    throw error;
  }
};

const listUsers = async () => {
  try {
    const users = await User.find({}, "-password -refreshToken");
    return users;
  } catch (error) {
    console.error("Error fetching users in service:", error);
    throw error;
  }
};

export default {
  register,
  login,
  refreshToken,
  createPlaylist,
  updateUserRole,
  listUsers,
};
