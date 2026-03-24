import express, { Router } from "express";
import {
  addPlaylist,
  listPlaylists,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/PlaylistController";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware";
import upload from "../middleware/multer";
import { checkPlaylistPermission } from "../controllers/PlaylistController";

const router: Router = express.Router();

router.get("/list-playlists", listPlaylists);

router.use(authenticateToken);

router.post("/add-playlist", upload.single("image"), addPlaylist);

router.delete("/delete-playlist/:_id", checkPlaylistPermission, deletePlaylist);

router.put(
  "/update-playlist/:_id",
  upload.single("image"),
  checkPlaylistPermission,
  updatePlaylist
);

export default router;
