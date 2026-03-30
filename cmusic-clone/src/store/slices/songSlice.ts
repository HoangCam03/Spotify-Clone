import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllSongs } from "../../services/SongServices/ListSongs";

interface Song {
  _id: string;
  name: string;
  artist: string;
  file: string;
  image: string;
  [key: string]: any;
}

interface SongState {
  items: Song[];
  currentTrack: Song | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SongState = {
  items: [],
  currentTrack: null,
  status: "idle",
  error: null,
};

export const fetchSongs = createAsyncThunk("songs/fetchSongs", async () => {
  const response = await getAllSongs();
  return response;
});

const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Song>) => {
      state.currentTrack = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSongs.fulfilled, (state, action: PayloadAction<Song[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
        if (action.payload.length > 0 && !state.currentTrack) {
          state.currentTrack = action.payload[0];
        }
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch songs";
      });
  },
});

export const { setCurrentTrack } = songSlice.actions;
export default songSlice.reducer;
