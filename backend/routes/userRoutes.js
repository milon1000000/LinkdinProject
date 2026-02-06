import express from "express";
import {
  getCurrentUser,
  getProfile,
  getUsers,
  search,
  suggestedUser,
  updateProfile,
} from "../app/controllers/userControllers.js";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";
import upload from "../app/middlewares/multer.js";

const userRouter = express.Router();

userRouter.get(
  "/getCurrentUser",
  AuthMiddleware,
  getCurrentUser
);

userRouter.put(
  "/updateProfile",
  AuthMiddleware,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateProfile
);

userRouter.get("/getProfile/:userName",AuthMiddleware,getProfile);
userRouter.get("/search",AuthMiddleware,search);
userRouter.get("/suggestedUser",AuthMiddleware,suggestedUser);
userRouter.get("/getUsers",AuthMiddleware,getUsers)

export default userRouter;
