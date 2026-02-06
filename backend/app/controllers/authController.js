import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import { TokenEncode } from "../utility/tokenUtility.js";

// signup
export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName) {
      return res
        .status(400)
        .json({ message: "first name is required", success: false });
    }
    if (!lastName) {
      return res
        .status(400)
        .json({ message: "last name is required", success: false });
    }
    if (!userName) {
      return res
        .status(400)
        .json({ message: "user name is required", success: false });
    }
    if (!email) {
      return res
        .status(400)
        .json({ message: "email name is required", success: false });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "password is required", success: false });
    }
    if (password.length < 8) {
      return res.status(400).json({
        message: "password must be at least 8 characters",
        success: false,
      });
    }

    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res
        .status(400)
        .json({ message: "email already exist", success: false });
    }
    const existUsername = await userModel.findOne({ userName });
    if (existUsername) {
      return res
        .status(400)
        .json({ message: "userName already exists", success: false });
    }

    // password hash
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashPassword,
    });

    const token = await TokenEncode(user.email, user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    return res
      .status(201)
      .json({ message: "user create successful", user, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "signup error", error: error.message, success: false });
  }
};

// login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "email is required", success: false });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "password is required", success: false });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "email does not exist !", success: false });
    }
    // match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "incorrect password", success: false });
    }

    // token
    const token = TokenEncode(user.email, user._id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    return res
      .status(200)
      .json({ message: "login successful", success: true, user, token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "login error", error: error.message, success: false });
  }
};

// logout controller

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    return res
      .status(200)
      .json({ message: "logout successful", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "logout error", error: error.message, success: false });
  }
};
