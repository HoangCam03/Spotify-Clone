import express, { Router } from "express";
import UserController from "../controllers/UserController";
import { authenticateToken } from "../middleware/authMiddleware";
import upload from "../middleware/multer";

const setupUserRouter = (forms: any): Router => {
  const router: Router = express.Router();

  router.post("/register", forms.none(), UserController.register);
  router.post("/login", forms.none(), UserController.login);
  router.post(
    "/create-playlist",
    authenticateToken,
    upload.single("image"),
    UserController.createPlaylist
  );
  router.post("/update-role", authenticateToken, UserController.updateRole);
  router.get("/list", authenticateToken, UserController.listUsers);

  return router;
};

export default setupUserRouter;
