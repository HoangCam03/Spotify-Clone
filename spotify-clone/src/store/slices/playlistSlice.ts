import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllPlaylists } from "../../services/PlaylistServices/ListPlaylists";

interface Playlist {
  _id: string;
  name: string;
  image: string;
  type: "personal" | "system";
  [key: string]: any;
}

interface PlaylistState {
  items: {
    data: Playlist[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
}

const initialState: PlaylistState = {
  items: {
    data: [],
    status: "idle",
    error: null,
  },
};

export const fetchPlaylists = createAsyncThunk(
  "playlists/fetchPlaylists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPlaylists();
      console.log("Redux fetchPlaylists response:", response);

      if ((response as any).status === "error") {
        if ((response as any).message === "Authentication failed") {
          return {
            status: "success",
            message: "Fetched system playlists only",
            playlists: (response as any).playlists?.filter((p: any) => p.type === "system") || [],
          };
        }
        return rejectWithValue((response as any).message);
      }

      return response;
    } catch (error: any) {
      console.error("Error in fetchPlaylists:", error);
      return rejectWithValue(error.message);
    }
  }
);

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    clearPlaylists: (state) => {
      const systemPlaylists = state.items.data.filter((p) => p.type === "system");
      state.items.data = systemPlaylists;
      state.items.status = "idle";
      state.items.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.items.status = "loading";
        state.items.error = null;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action: PayloadAction<any>) => {
        state.items.status = "succeeded";

        if (action.payload && action.payload.playlists) {
          const playlists: Playlist[] = action.payload.playlists;
          const systemPlaylists = playlists.filter((p) => p.type === "system");
          const personalPlaylists = playlists.filter((p) => p.type === "personal");

          const existingSystemPlaylists = state.items.data.filter((p) => p.type === "system");
          const finalSystemPlaylists = systemPlaylists.length > 0 ? systemPlaylists : existingSystemPlaylists;

          state.items.data = [...finalSystemPlaylists, ...personalPlaylists];

          console.log("Redux state updated:", {
            systemPlaylists: finalSystemPlaylists,
            personalPlaylists,
            total: state.items.data.length,
          });
        } else {
          console.error("Invalid playlist data structure:", action.payload);
          state.items.data = state.items.data.filter((p) => p.type === "system");
        }
      })
      .addCase(fetchPlaylists.rejected, (state, action) => {
        state.items.status = "failed";
        state.items.error = (action.payload as string) || action.error.message || "Failed to fetch playlists";
        state.items.data = state.items.data.filter((p) => p.type === "system");
        console.error("Playlist fetch failed:", state.items.error);
      });
  },
});

export const { clearPlaylists } = playlistSlice.actions;
export default playlistSlice.reducer;
