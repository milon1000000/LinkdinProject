import express from "express";
import { getMessage, sendMessageController } from "../app/controllers/messageController.js";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";

const messageRoute=express.Router();

// all api

messageRoute.post("/send/:id",AuthMiddleware,sendMessageController);
messageRoute.get("/getMessage/:id",AuthMiddleware,getMessage)

export default messageRoute