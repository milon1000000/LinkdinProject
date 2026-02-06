import usermodel from "../model/userModel.js";
import Connection from "../model/connectionModel.js";
// import {io,userSoketMap} from "../app.js"
import { io, userSoketMap } from "../../app.js";
import Notification from "../model/notificationsModel.js";
// Send Connection Request
export const sendConnection = async (req, res) => {
  try {
    const { id } = req.params; // receiver id
    const sender = req.headers.user_id;

    if (!sender) {
      return res.status(401).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    if (sender === id) {
      return res.status(400).json({
        message: "You cannot send a request to yourself",
        success: false,
      });
    }

    const senderUser = await usermodel.findById(sender);
    const receiverUser = await usermodel.findById(id);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({
        message: "Sender or receiver not found",
        success: false,
      });
    }

    // Already connected check
    if (senderUser.connection?.includes(id)) {
      return res.status(400).json({
        message: "You are already connected",
        success: false,
      });
    }

    // Existing pending request check
    const existingRequest = await Connection.findOne({
      sender,
      receiver: id,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already exists",
        success: false,
      });
    }

    const newRequest = await Connection.create({
      sender,
      receiver: id,
    });

    let receiverSoketId = userSoketMap.get(id);
    let senderSoketId = userSoketMap.get(sender);

    if (receiverSoketId) {
      io.to(receiverSoketId).emit("statusUpdate", {
        updateUserId: sender,
        newStatus: "received",
      });
    }

    if (senderSoketId) {
      io.to(senderSoketId).emit("statusUpdate", {
        updateUserId: id,
        newStatus: "pending",
      });
    }

    return res.status(200).json({
      message: "Connection request sent successfully",
      newRequest,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal send connection error",
      error: error.message,
      success: false,
    });
  }
};

// Accept Connection Request
export const acceptConnection = async (req, res) => {
  try {
    const userId = req.headers.user_id; // receiver
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(400).json({
        message: "Connection does not exist",
        success: false,
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
        success: false,
      });
    }

    // update connection status
    connection.status = "accepted";
    const notification=await Notification.create({
      receiver:connection.sender,
      type:"connectionAccepted",
      relatedUser:userId,
    })
    await connection.save();

    //FIXED: direct ObjectId use
    await usermodel.findByIdAndUpdate(connection.sender, {
      $addToSet: { connection: userId },
    });

    await usermodel.findByIdAndUpdate(userId, {
      $addToSet: { connection: connection.sender },
    });

    // socket
    const receiverSocketId = userSoketMap.get(connection.receiver.toString());
    const senderSocketId = userSoketMap.get(connection.sender.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updateUserId: connection.sender,
        newStatus: "disconnect",
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updateUserId: userId,
        newStatus: "disconnect",
      });
    }

    return res.status(200).json({
      message: "Connection accepted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal accept connection error",
      error: error.message,
      success: false,
    });
  }
};


// Reject Connection Request
export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res
        .status(400)
        .json({ message: "Connection does not exist", success: false });
    }

    if (connection.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Request already processed", success: false });
    }

    // Update status to rejected
    connection.status = "rejected";
    await connection.save();

    return res.status(200).json({
      message: "Connection rejected",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal reject connection error",
      error: error.message,
      success: false,
    });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetgetUserId = req.params.userId;
    const currentUserId = req.headers.user_id;

    let currentUser = await usermodel.findById(currentUserId);
    if (currentUser.connection.includes(targetgetUserId)) {
      return res.status(200).json({ status: "disconnect" });
    }

    const pendingRequest = await Connection.findOne({
      $or: [
        { sender: currentUserId, receiver: targetgetUserId },
        { sender: targetgetUserId, receiver: currentUser },
      ],
      status: "pending",
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }

    return res.json({ status: "Connect" ,pendingRequest});
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal get connection status error",
      error: error.message,
      success: false,
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.headers.user_id;
    const otherUserId = req.params.userId;

    await usermodel.findByIdAndUpdate(myId, {
      $pull: { connection: otherUserId },
    });
    await usermodel.findByIdAndUpdate(otherUserId, {
      $pull: { connection: myId },
    });

    let receiverSoketId = userSoketMap.get(otherUserId);
    let senderSoketId = userSoketMap.get(myId);
    if (receiverSoketId) {
      io.to(receiverSoketId).emit("statusUpdate", {
        updateUserId: myId,
        newStatus: "connect",
      });
    }
    if (senderSoketId) {
      io.to(senderSoketId).emit("statusUpdate", {
        updateUserId: otherUserId,
        newStatus: "connect",
      });
    }

    return res.json({ message: "Connection removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal remove connection error",
      error: error.message,
      success: false,
    });
  }
};

export const getConnectionRequest = async (req, res) => {
  try {
    const userId = req.headers.user_id;
    const requests = await Connection.find({
      receiver: userId,
      status: "pending",
    }).populate(
      "sender",
      "firstName lastName email userName profileImage headline"
    );
    return res.status(200).json({
      message: "get connection request successfully",
      success: true,
      requests,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal get connection request error",
      error: error.message,
      success: false,
    });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.headers.user_id;

    const user = await usermodel
      .findById(userId)
      .populate(
        "connection",
        "firstName lastName userName profileImage headline connection"
      );
    return res.status(200).json({user:user.connection,
      message: "get user connections successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal get user connections error",
      error: error.message,
      success: false,
    });
  }
};
