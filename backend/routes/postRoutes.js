import express from "express";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";
import upload from "../app/middlewares/multer.js";
import { comment, createPost, deletePostController, getPost, like } from "../app/controllers/postController.js";
const postRouter = express.Router();

// create post
postRouter.post(
  "/createPost",
  AuthMiddleware,
  upload.single("image"),
  createPost
);

// get post

postRouter.get("/getPost",AuthMiddleware,getPost);
postRouter.delete("/delete/:id",AuthMiddleware,deletePostController)
postRouter.get("/like/:id",AuthMiddleware,like);
postRouter.post("/comment/:id",AuthMiddleware,comment)


export default postRouter;
