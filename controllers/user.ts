import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import express from "express";

dotenv.config();

export const create = async (req, res, next) => {
  try {
    const {
      _id,
      loginType,
      name,
      image,
      biography,
      website,
      email,
      password,
      confirmedPassword,
    }: {
      _id?: string;
      loginType: string;
      name: string;
      image: string;
      biography: string;
      website: string;
      email: string;
      password?: string;
      confirmedPassword?: string;
    } = req.body;

    let userData = {};
    let existingUser;

    // if we are creating via email, we will need to generate an id. we will get the user id from google for google creation
    if (loginType.toUpperCase() == "EMAIL") {
      existingUser = User.findOne({ email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ message: "A user with that email already exists" });

      if (password === confirmedPassword)
        return res.status(400).json({ message: "Passwords do not match." });

      const hashedPassword = await bcrypt.hash(password, 12);

      userData = {
        name,
        image,
        biography,
        website,
        password: hashedPassword,
        profileType: loginType,
      };
    } else if (loginType.toUpperCase() == "GOOGLE") {
      existingUser = User.findOne({ email: email });
      if (existingUser)
        return res.status(400).json({
          message: "A user associated with that Google account already exists",
        });

      userData = {
        _id,
        name,
        image,
        biography,
        website,
        profileType: loginType,
      };
    } else {
      return res
        .status(500)
        .json({ message: `ERROR. Unknown login type ${loginType}` });
    }

    const user = User.create(userData);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
      loginType,
      _id,
    }: { email?: string; password?: string; loginType: string; _id?: string } =
      req.body;

    let existingUser;

    if (loginType.toUpperCase() == "GOOGLE")
      existingUser = await User.findOne({ _id });
    else if (loginType.toUpperCase() == "EMAIL")
      existingUser = await User.findOne({ email });
    else
      return res
        .status(500)
        .json({ message: `ERROR. Unknown login type ${loginType}` });

    if (!existingUser)
      res.status(404).json({ message: "user does not exist with that email" });

    if (loginType.toUpperCase() == "EMAIL") {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordCorrect)
        return res
          .status(400)
          .json({ message: `ERROR. Unknown login type ${loginType}` });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const {
      _id,
      name,
      image,
      biography,
      website,
    }: {
      _id: string;
      _type: string;
      name: string;
      image?: string;
      biography?: string;
      website?: string;
    } = req.body;

    const user = await User.updateOne(
      { _id },
      {
        name,
        biography,
        website,
        image,
      }
    );

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserByID = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await User.findById(id);

    if (!result) res.status(400).json({ message: "User not found" });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
