import { io } from "../../app.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../model/notificationsModel.js";
import postModel from "../model/postModel.js";

export const createPost = async (req, res) => {
  const id = req.headers.user_id;
  try {
    const { description } = req.body;

    //description + image দুটাই না থাকলে error
    if (!description && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Post must have description or image",
      });
    }

    let post;

    if (req.file) {
      const image = await uploadOnCloudinary(req.file.path, "image");

      post = await postModel.create({
        author: id,
        description,
        image,
      });
    } else {
      post = await postModel.create({
        author: id,
        description,
      });
    }

    post = await post.populate(
      "author",
      "firstName lastName profileImage headline",
    );

    return res.status(201).json({
      message: "create post user successful",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal create post error",
      error: error.message,
      success: false,
    });
  }
};

// controllers/postController.js

export const getPost = async (req, res) => {
  try {
    const post = await postModel
      .find()
      .populate("author", "firstName lastName userName profileImage headline")
      .populate(
        "comment.user",
        "firstName lastName userName profileImage headline",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Post fetch error",
    });
  }
};


export const deletePostController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await postModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delete successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal delete error",error:error.message
    });
  }
};


export const like = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.headers.user_id;

    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ message: "post not found", success: false });
    }

    if (post.like.includes(userId)) {
      post.like = post.like.filter((id) => id != userId);
    } else {
      post.like.push(userId);
      if (post.author != userId) {
        const notification = await Notification.create({
          receiver: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });
      }
    }
    await post.save();

    io.emit("likeUpdated", { postId, likes: post.like });

    return res
      .status(200)
      .json({ message: "like successful", success: true, post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal like error",
      error: error.message,
      success: false,
    });
  }
};

export const comment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.headers.user_id;
    const { content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ message: "content is required", success: false });
    }
    const post = await postModel
      .findByIdAndUpdate(
        postId,
        {
          $push: {
            comment: { content, user: userId, createdAtDate: new Date() },
          },
        },
        { new: true },
      )
      .populate(
        "comment.user",
        "firstName lastName userName profileImage headline",
      );
    if (post.author != userId) {
      const notification = await Notification.create({
        receiver: post.author,
        type: "comment",
        relatedUser: userId,
        relatedPost: postId,
      });
    }
    io.emit("commentAdd", { postId, comment: post.comment });
    return res
      .status(200)
      .json({ message: "comment successful", success: true, post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal comment error",
      error: error.message,
      success: false,
    });
  }
};
