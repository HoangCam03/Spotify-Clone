import mongoose, { Schema, Document } from "mongoose";

export interface ISong extends Document {
  name: string;
  artist: string;
  desc: string;
  playlist: mongoose.Types.ObjectId;
  album: string;
  image: string;
  duration: string;
  file: string;
}

const songSchema = new mongoose.Schema<ISong>({
  name: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
});

const Song = mongoose.models.Song || mongoose.model<ISong>("Song", songSchema);

export default Song;
