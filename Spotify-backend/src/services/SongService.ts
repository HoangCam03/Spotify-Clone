import Song from "../models/songModel";
import Playlist from "../models/playlistModel";
import { ISong } from "../models/songModel";

interface NewSongData {
  name: string;
  artist: string;
  desc: string;
  playlist: string;
  album: string;
  duration: string;
  file: string;
  image: string;
}

interface ServiceResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
}

const createSong = (newSong: NewSongData): Promise<ServiceResponse<ISong>> => {
  return new Promise(async (resolve, reject) => {
    const { name, artist, desc, playlist, album, duration, file, image } = newSong;
    try {
      const existingSong = await Song.findOne({ name, artist, playlist });
      if (existingSong !== null) {
        resolve({
          status: "error",
          message: "Song already exists",
        });
        return;
      }
      const createdSong = await Song.create({
        name,
        artist,
        desc,
        playlist,
        album,
        duration,
        file,
        image,
      });
      await Playlist.findByIdAndUpdate(playlist, {
        $push: { songs: createdSong._id },
      });
      resolve({
        status: "success",
        message: "Song created successfully",
        data: createdSong,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const listSongs = (): Promise<ServiceResponse<ISong[]>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const songs = await Song.find();
      resolve({
        status: "success",
        message: "Songs fetched successfully",
        data: songs,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const deleteSong = (songId: string): Promise<ServiceResponse<any>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkSong = await Song.findOne({ _id: songId });

      console.log("checkSong: ", checkSong);

      if (checkSong === null) {
        resolve({
          status: "error",
          message: "The Song is not defined",
        });
        return;
      }

      console.log("Song ID:", checkSong._id);

      await Song.findByIdAndDelete(songId);

      if (checkSong.playlist) {
        await Playlist.findByIdAndUpdate(checkSong.playlist, {
          $pull: { songs: checkSong._id },
        });
      }
      resolve({
        status: "success",
        message: "Song deleted successfully",
      });
    } catch (error) {
      console.error("Delete song failed", (error as any).message);
      reject(error);
    }
  });
};

const updateSong = async (songId: string, updatedFields: any): Promise<ISong | null> => {
  try {
    const song = await Song.findByIdAndUpdate(songId, updatedFields, { new: true });
    return song;
  } catch (error) {
    console.error("Update song failed", (error as any).message);
    throw error;
  }
};

export default {
  createSong,
  listSongs,
  deleteSong,
  updateSong,
};
