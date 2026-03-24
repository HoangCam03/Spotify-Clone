import express, { Router } from "express";
import SongController from "../controllers/SongController";
import upload from "../middleware/multer";

const router: Router = express.Router();

router.post(
  "/add-song",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  SongController.addSong
);

router.get("/list-songs", SongController.listSong);

router.delete("/delete-song/:_id", SongController.deleteSong);

router.put(
  "/update-song/:_id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  SongController.editSong
);

export default router;
