import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import PlaylistService from "../services/PlaylistService";
import User from "../models/userModel";
import Playlist from "../models/playlistModel";

export const checkPlaylistPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const playlistId = req.params._id;
    const userId = req.user?.id;
    const user = await User.findById(userId);

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    if (user && user.role === "admin") {
      return next();
    }

    if (playlist.type === "personal" && playlist.createdBy.toString() === userId) {
      return next();
    }

    res.status(403).json({ error: "You don't have permission to perform this action" });
  } catch (error: any) {
    console.error("Permission check error:", error);
    res.status(500).json({ error: "Error checking permissions" });
  }
};

export const addPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("request body", req.body);
    console.log("files", req.file);

    const { name, desc, bgcolor } = req.body;
    const imageFile = req.file;
    const createdBy = req.user?.id;

    if (!name || !desc || !bgcolor) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    if (!imageFile) {
      res.status(400).json({ error: "Missing image file" });
      return;
    }
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const newPlaylist = await PlaylistService.createPlaylist({
      name,
      desc,
      bgcolor,
      image: imageUpload.secure_url,
      createdBy: createdBy!,
    });

    if (newPlaylist.status === "error") {
      res.status(400).json({ error: newPlaylist.message });
      return;
    }

    res.status(201).json({
      message: "Upload & save successful",
      playlist: newPlaylist.data,
    });
  } catch (error: any) {
    console.error("Upload failed", error.message);
    const message = error.message === "Playlist already exists" ? error.message : "Upload failed";
    const statusCode = error.message === "Playlist already exists" ? 400 : 500;

    res.status(statusCode).json({ error: message });
  }
};

export const listPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const serviceResult = await PlaylistService.listPlaylists();
      if (serviceResult.status === "success" && serviceResult.data) {
        const systemPlaylists = serviceResult.data.filter((playlist) => playlist.type === "system");
        res.status(200).json({
          message: "System playlists fetched successfully",
          playlists: systemPlaylists,
        });
        return;
      }
      res.status(500).json({
        message: serviceResult.message || "Failed to fetch system playlists",
      });
      return;
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    const serviceResult =
      user?.role === "admin"
        ? await PlaylistService.listPlaylists()
        : await PlaylistService.listPlaylists(userId);

    if (serviceResult.status === "success" && serviceResult.data) {
      res.status(200).json({
        message: "Playlists fetched successfully",
        playlists: serviceResult.data,
      });
    } else {
      res.status(serviceResult.status === "error" ? 400 : 500).json({
        message: serviceResult.message || "Failed to fetch playlists from service",
      });
    }
  } catch (error: any) {
    console.error("Fetch playlists failed in controller", error);
    res.status(500).json({ message: "Failed to fetch playlists", error: error.message });
  }
};

export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params._id;
    const userId = req.user?.id;
    const user = await User.findById(userId);

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    if (playlist.type === "personal") {
      await User.findByIdAndUpdate(userId, {
        $pull: { createdPlaylists: playlistId },
      });
    }

    const deletedPlaylist = await PlaylistService.deletePlaylist(playlistId);
    if (deletedPlaylist.status === "error") {
      res.status(404).json({ error: deletedPlaylist.message });
      return;
    }

    res.status(200).json({
      status: "Success",
      message: "Playlist deleted successfully",
      playlist: deletedPlaylist.data,
    });
  } catch (error: any) {
    console.error("Delete failed", error.message);
    res.status(500).json({ error: "Delete failed" });
  }
};

export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlistId = req.params._id;
    const userId = req.user?.id;
    const { name, desc, bgcolor } = req.body;
    const imageFile = req.file;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    const user = await User.findById(userId);
    if (!user || (user.role !== "admin" && (playlist.type !== "personal" || playlist.createdBy.toString() !== userId))) {
      res.status(403).json({ error: "You don't have permission to update this playlist" });
      return;
    }

    let updatedFields: any = { name, desc, bgcolor };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updatedFields.image = imageUpload.secure_url;
    }

    const updatedPlaylist = await PlaylistService.updatePlaylist(playlistId, updatedFields);

    if (updatedPlaylist) {
      res.status(200).json({
        message: "Playlist updated successfully",
        playlist: updatedPlaylist,
      });
    } else {
      res.status(404).json({ error: "Playlist not found" });
    }
  } catch (error: any) {
    console.error("Update failed", error.message);
    res.status(500).json({ error: "Update failed" });
  }
};


export default { checkPlaylistPermission, addPlaylist, listPlaylists, deletePlaylist, updatePlaylist };
