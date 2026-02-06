import mongoose from "mongoose";
import { Conversation } from "../model/conversationModel.js";
import { Message } from "../model/messageModel.js";

export const sendMessageController = async (req, res) => {
  const id = req.params.id;
  const senderId = req.headers.user_id;
  const { message } = req.body;

  try {
    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, id] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, id],
      });
    }

    // Create message
    const newMessage = await Message({
      senderId,
      receiverId: id,
      message,
    });

    // Update conversation
    conversation.message.push(newMessage._id);

    //SOCKET IO

    await Promise.all([conversation.save(), newMessage.save()]);
    return res.status(200).json({
      message: "send message successful",
      newMessage,
      success: true,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json({ message: "Invalid Id format", success: false });
    }

    console.log(error);
    return res.status(500).json({
      message: "Internal send message error",
      error: error.message,
      success: false,
    });
  }
};




export const getMessage = async (req, res) => {
  const receiverId = req.params.id;
  const senderId = req.headers.user_id;


  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("message"); // field name must match schema

    if (!conversation) return res.status(200).json([]);

    return res.status(200).json(conversation.message);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid Id format", success: false });
    }
    console.log(error);
    return res.status(500).json({
      message: "Internal get message error",
      error: error.message,
      success: false,
    });
  }
};