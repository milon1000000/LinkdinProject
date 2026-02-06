import { v2 as cloudinary } from "cloudinary";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../model/userModel.js"; // 'User' match করা দরকার

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  const id = req.headers.user_id;
  try {
    const user = await User.findById(id); //use 'User'
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "Get user successful", success: true, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Get current user error",
      error: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  const id = req.headers.user_id;

  try {
    // find existing user
    const existUser = await User.findById(id);
    if (!existUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { firstName, lastName, userName, headline, location, gender } =
      req.body;
    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    const education = req.body.education ? JSON.parse(req.body.education) : [];
    const experience = req.body.experience
      ? JSON.parse(req.body.experience)
      : [];

    let profileImage = existUser.profileImage;
    let coverImage = existUser.coverImage;

    // profileImage update
    if (req?.files?.profileImage) {
      if (existUser.profileImage?.public_id) {
        await cloudinary.uploader.destroy(existUser.profileImage.public_id); // delete old image
      }
      profileImage = await uploadOnCloudinary(
        req.files.profileImage[0].path,
        "profileImage",
      ); // upload new
    }

    // coverImage update
    if (req?.files?.coverImage) {
      if (existUser.coverImage?.public_id) {
        await cloudinary.uploader.destroy(existUser.coverImage.public_id); // delete old image
      }
      coverImage = await uploadOnCloudinary(
        req.files.coverImage[0].path,
        "coverImage",
      ); // upload new
    }

    // update user
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        userName,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        profileImage,
        coverImage,
      },
      { new: true },
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Update profile failed",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  const userName = req.params.userName;

  if (!userName) {
    return res.status(400).json({
      message: "userName is required",
      success: false,
    });
  }

  try {
    // findOne expects an object
    const user = await User.findOne({ userName: userName });

    if (!user) {
      return res.status(404).json({
        message: "userName does not exist",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User Name exists",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal get profile error",
      error: error.message,
      success: false,
    });
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ message: "query is requires", success: false });
    }
    const user = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { skills: { $in: [query] } },
      ],
    });

    return res
      .status(200)
      .json({ message: "search user", user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal search error",
      error: error.message,
      success: false,
    });
  }
};

export const suggestedUser = async (req, res) => {
  try {
    const currentUserId = req.headers.user_id;

    const user = await User.findById(currentUserId);

    const suggestedUsers = await User.find({
      _id: { $nin: [currentUserId, ...user.connection] },
    })
      .select("-password")
      .limit(5);

    res.status(200).json({
      success: true,
      suggestedUser: suggestedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getUsers=async(req,res)=>{
  const id=req.headers.user_id;
  try{
    const users=await User.find({_id:{$ne:id}})
    return res.status(200).json({message:"get users",users})

  }catch(error){
     console.log(error);
    return res.status(500).json({
      message: "Internal get users error",
      error: error.message,
      success: false,
    });
  }
}