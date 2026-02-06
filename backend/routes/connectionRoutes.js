import express from "express";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";
import { acceptConnection, getConnectionRequest, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendConnection } from "../app/controllers/connectionController.js";

const connectionRouter=express.Router();

// all api
connectionRouter.post("/sendConnection/:id",AuthMiddleware,sendConnection);
connectionRouter.put("/accept/:connectionId",AuthMiddleware,acceptConnection);
connectionRouter.put("/reject/:connectionId",AuthMiddleware,rejectConnection);
connectionRouter.get("/getConnectionStatus/:userId",AuthMiddleware,getConnectionStatus);
connectionRouter.delete("/removeConnection/:userId",AuthMiddleware,removeConnection);
connectionRouter.get("/getConnectionRequest",AuthMiddleware,getConnectionRequest);
connectionRouter.get("/",AuthMiddleware,getUserConnections)

export default connectionRouter;