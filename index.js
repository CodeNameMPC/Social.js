import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path'
import crypto from 'crypto'

import multer from "multer";

import postsRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

const app = express();
dotenv.config();

app.use(
  bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 100000 })
);
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);
app.use(cors());

app.use((error, req, res, next) => {
  console.log("Error Handlign Middleware Called");
  console.log(`Path: ${req.path}`);
  console.log(`Error: ${error}`);

  res.status(500).send(error);
});


app.use("/posts", postsRoutes);
app.use("/users", uploadMiddleware, userRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    })
  })
  .catch((error) => console.log(error.message));
