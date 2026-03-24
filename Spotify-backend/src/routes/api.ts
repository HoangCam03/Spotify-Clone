import express, { Express } from "express";
import SongRouter from "./songRouter";
import PlaylistRouter from "./PlaylistRouter";
import setupUserRouter from "./UserRouter";

const routes = (app: Express, forms: any): void => {
  const userRouter = setupUserRouter(forms);
  app.use("/api/user", userRouter);
  app.use("/api/song", SongRouter);
  app.use("/api/playlist", PlaylistRouter);
};

export default routes;
