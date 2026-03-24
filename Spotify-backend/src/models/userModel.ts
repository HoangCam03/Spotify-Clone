import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username?: string;
  email: string;
  password: string;
  profilePictureUrl?: string;
  country?: string;
  language: string;
  subscriptionType: "free" | "premium" | "family" | "trial";
  refreshToken?: string;
  role: "user" | "admin";
  likedSongs: mongoose.Types.ObjectId[];
  followedArtists: mongoose.Types.ObjectId[];
  followedUsers: mongoose.Types.ObjectId[];
  createdPlaylists: mongoose.Types.ObjectId[];
  savedAlbums: mongoose.Types.ObjectId[];
  savedPodcasts: mongoose.Types.ObjectId[];
  recentlyPlayed: mongoose.Types.ObjectId[];
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  gender: "man" | "woman" | "non-binary" | "something-else" | "prefer-not-to-say";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      trim: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePictureUrl: {
      type: String,
      default: "",
    },
    country: {
      type: String,
    },
    language: {
      type: String,
      default: "en",
    },
    subscriptionType: {
      type: String,
      enum: ["free", "premium", "family", "trial"],
      default: "free",
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    likedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    followedArtists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
    followedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdPlaylists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ],
    savedAlbums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
    savedPodcasts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Podcast",
      },
    ],
    recentlyPlayed: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    dateOfBirth: {
      day: {
        type: String,
        required: true,
      },
      month: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
    },
    gender: {
      type: String,
      enum: ["man", "woman", "non-binary", "something-else", "prefer-not-to-say"],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
