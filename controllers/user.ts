import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import express from "express";
import { USER_NOT_FOUND, PASSWORDS_INCORRECT, PASSWORDS_NOT_MATCH, USER_EXISTS } from "../constants/errorCodes.js";
import { IUser } from "../types/user.js";

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
    }: IUser= req.body;

    let userData = {};
    let existingUser;

    // if we are creating via email, we will need to generate an id. we will get the user id from the other source for other logins
    // if the loginType is EMAIL, then the username/password combination is unique to this site.
    // if the loginType != EMAIL, then this login is done via a 3rd party (Google, Facebook, Twitter, Github, etc) using their auth,
    // we just create a profile based off that
    if (loginType.toUpperCase() == "EMAIL") {
      existingUser = User.findOne({ email: email });
      if (existingUser)
        return res
          .status(400)
          .json({ message: USER_EXISTS });

      if (password === confirmedPassword)
        return res.status(400).json({ message: PASSWORDS_NOT_MATCH });

      // TODO: Look into BCRYPT more. I don't think this is the best way to do this
      const hashedPassword = await bcrypt.hash(String(password), 12);

      userData = {
        name,
        image,
        biography,
        website,
        password: hashedPassword,
        profileType: loginType,
      };
    } else { 
      // There was code to see if it was just google. However, not that I think about it, it can be any website login other than an email/password (github, twitter, facebook, anything)
      // I also realized that searching just be email here is probably a bad idea, let's search by eMail, login type, AND ID Instead
      existingUser = User.findById({_id, email, loginType});
      if (existingUser)
        return res.status(400).json({
          message: USER_EXISTS,
        });

      userData = {
        _id,
        name,
        image,
        biography,
        website,
        profileType: loginType,
      };
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
    }: IUser =
      req.body;

    let existingUser;

    if (loginType.toUpperCase() == "EMAIL")
      existingUser = await User.findOne({ email });  
    else 
      existingUser = User.findById({_id, email, loginType});

    if (!existingUser)
      res.status(404).json({ message: USER_NOT_FOUND });

    if (loginType.toUpperCase() == "EMAIL") {
      // I know this is ugly but if you go in via OTHER login, a password won't be provided 
      // but bcrypt.compare does not like a possible undefined variable even though technically it wont be here
      const isPasswordCorrect = await bcrypt.compare(
        String(password), 
        existingUser.password
      );

      if (!isPasswordCorrect)
        return res
          .status(400)
          .json({ message: PASSWORDS_INCORRECT });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      String(process.env.JWT_SECRET)
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
    }: IUser = req.body;

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
  const { _id } = req.body;

  try {
    const result = await User.findById(_id);

    if (!result) res.status(400).json({ message:  USER_NOT_FOUND});

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
