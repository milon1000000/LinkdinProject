import express from "express";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";
import { clearAllNotifications, deleteNotifications, getNotifications } from "../app/controllers/notificationController.js";
const notificationRouter=express.Router();

// all api
notificationRouter.get("/getNotifications",AuthMiddleware,getNotifications);
notificationRouter.delete("/deleteNotifications/:id",AuthMiddleware,deleteNotifications);
notificationRouter.delete("/clearAllNotifications",AuthMiddleware,clearAllNotifications)

export default  notificationRouter;