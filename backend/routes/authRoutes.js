import express from "express";
import { login, logout, signUp } from "../app/controllers/authController.js";
const authRouter = express.Router();

// sign up api
authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

export default authRouter;
