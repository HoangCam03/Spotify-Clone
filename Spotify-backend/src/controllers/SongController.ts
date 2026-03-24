import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import SongService from "../services/SongService";

const addSong = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("request body", req.body);
    console.log("files", (req as any).files);
    const { name, artist, desc, playlist, album } = req.body;
    const audioFile = (req as any).files?.audio?.[0];
    const imageFile = (req as any).files?.image?.[0];

    if (!name || !artist || !desc || !playlist || !album) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!audioFile || !imageFile) {
      res.status(400).json({ error: "Missing audio or image file" });
      return;
    }

    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const duration = `${Math.floor(audioUpload.duration / 60)}:${audioUpload.duration % 60}`;

    console.log(name, desc, playlist, album, audioUpload, imageUpload);

    const newSong = await SongService.createSong({
      name,
      artist,
      desc,
      playlist: new mongoose.Types.ObjectId(playlist),
      album,
      duration,
      file: audioUpload.secure_url,
      image: imageUpload.secure_url,
    } as any);

    res.status(201).json({
      message: "Upload & save successful",
      song: newSong,
    });
  } catch (error: any) {
    console.error("Upload failed", error.message);
    const message = error.message === "Song already exists" ? error.message : "Upload failed";
    const statusCode = error.message === "Song already exists" ? 400 : 500;

    res.status(statusCode).json({ error: message });
  }
};

const listSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const songs = await SongService.listSongs();
    res.status(200).json(songs);
  } catch (error: any) {
    console.error("List songs failed", error.message);
    res.status(500).json({ error: "List songs failed" });
  }
};

const deleteSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const songId = req.params._id;
    const deletedSong = await SongService.deleteSong(songId);
    if (deletedSong) {
      res.status(200).json({ status: "Success", message: "Song deleted successfully" });
    } else {
      res.status(404).json({ error: "Song not found" });
    }
  } catch (error: any) {
    console.error("Delete song failed", error.message);
    res.status(500).json({ error: "Delete song failed" });
  }
};

const editSong = async (req: Request, res: Response): Promise<void> => {
  try {
    const songId = req.params._id;
    const { name, artist, desc, playlist, album } = req.body;
    const audioFile = (req as any).files?.audio?.[0];
    const imageFile = (req as any).files?.image?.[0];

    let updatedFields: any = {
      name,
      artist,
      desc,
      playlist: new mongoose.Types.ObjectId(playlist),
      album,
    };

    if (audioFile) {
      const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
        resource_type: "video",
      });
      updatedFields.file = audioUpload.secure_url;
      updatedFields.duration = `${Math.floor(audioUpload.duration / 60)}:${audioUpload.duration % 60}`;
    }

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updatedFields.image = imageUpload.secure_url;
    }

    const updatedSong = await SongService.updateSong(songId, updatedFields);

    if (updatedSong) {
      res.status(200).json({
        message: "Song updated successfully",
        song: updatedSong,
      });
    } else {
      res.status(404).json({ error: "Song not found" });
    }
  } catch (error: any) {
    console.error("Edit song failed", error.message);
    res.status(500).json({ error: "Edit song failed" });
  }
};

export default { addSong, listSong, deleteSong, editSong };
