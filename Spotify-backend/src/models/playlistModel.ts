import mongoose, { Schema, Document } from "mongoose";

export interface IPlaylist extends Document {
  name: string;
  image: string;
  desc: string;
  bgcolor: string;
  file?: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  owner?: mongoose.Types.ObjectId;
  isPublic: boolean;
  type: "personal" | "system";
  createdBy: mongoose.Types.ObjectId;
}

const playlistSchema = new mongoose.Schema<IPlaylist>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    default: "",
  },
  bgcolor: {
    type: String,
    default: "#ffffff",
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: ["personal", "system"],
    default: "personal",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Playlist = mongoose.models.Playlist || mongoose.model<IPlaylist>("Playlist", playlistSchema);

export default Playlist;
