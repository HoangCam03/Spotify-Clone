import Playlist from "../models/playlistModel";
import User from "../models/userModel";
import { IPlaylist } from "../models/playlistModel";

interface PlaylistData {
  name: string;
  desc: string;
  bgcolor: string;
  image: string;
  createdBy: string;
}

interface ServiceResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
}

const createPlaylist = (playlistData: PlaylistData): Promise<ServiceResponse<IPlaylist>> => {
  return new Promise(async (resolve, reject) => {
    const { name, desc, bgcolor, image, createdBy } = playlistData;
    try {
      const user = await User.findById(createdBy);
      if (!user) {
        resolve({
          status: "error",
          message: "User not found",
        });
        return;
      }

      const existingPlaylist = await Playlist.findOne({ name });
      if (existingPlaylist !== null) {
        resolve({
          status: "error",
          message: "Playlist already exists",
        });
        return;
      }

      const playlistType = user.role === "admin" ? "system" : "personal";

      const playlist = await Playlist.create({
        name,
        desc,
        bgcolor,
        image,
        type: playlistType,
        createdBy,
        owner: playlistType === "personal" ? createdBy : null,
      });

      if (playlistType === "personal") {
        await User.findByIdAndUpdate(createdBy, {
          $push: { createdPlaylists: playlist._id },
        });
      }

      resolve({
        status: "success",
        message: "Playlist created successfully",
        data: playlist,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const listPlaylists = (userId?: string): Promise<ServiceResponse<IPlaylist[]>> => {
  return new Promise(async (resolve, reject) => {
    try {
      let query: any = {};

      if (userId) {
        query = {
          $or: [{ type: "system" }, { type: "personal", createdBy: userId }],
        };
      } else {
        query = { type: "system" };
      }

      const playlists = await Playlist.find(query)
        .populate("createdBy", "username email role")
        .populate("owner", "username email")
        .sort({ type: 1, createdAt: -1 });

      resolve({
        status: "success",
        message: "Playlists fetched successfully",
        data: playlists,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deletePlaylist = async (playlistId: string): Promise<ServiceResponse<IPlaylist>> => {
  try {
    const checkPlaylist = await Playlist.findOne({ _id: playlistId });

    if (!checkPlaylist) {
      return {
        status: "error",
        message: "The Playlist is not defined",
      };
    }

    await Playlist.findByIdAndDelete(playlistId);
    return {
      status: "success",
      message: "Playlist deleted successfully",
      data: checkPlaylist,
    };
  } catch (error) {
    console.error("Delete playlist failed", (error as any).message);
    throw error;
  }
};

const updatePlaylist = async (playlistId: string, updatedFields: any): Promise<IPlaylist | null> => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(playlistId, updatedFields, { new: true });
    return playlist;
  } catch (error) {
    console.error("Update playlist failed", (error as any).message);
    throw error;
  }
};

export default {
  createPlaylist,
  listPlaylists,
  deletePlaylist,
  updatePlaylist,
};
