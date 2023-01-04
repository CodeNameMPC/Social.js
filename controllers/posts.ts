import Post from "../models/post.js";
import mongoose from "mongoose";
import { IPost } from "../types/post.js";
import {
  POST_DELETED_SUCESS,
  POST_NOT_FOUND,
  SEARCH_POSTS_NOT_FOUND,
  USER_POSTS_NOT_FOUND,
} from "../constants/errorCodes.js";


export const getPostsByUser = async (req, res) => {
  try {
    const {id} = req.params

    var foundPosts = await Post.find({createdBy: id})

    if (!foundPosts || foundPosts.length == 0)  return res.status(404).send(USER_POSTS_NOT_FOUND);

    res.status(200).json(foundPosts)
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getPostsForUsersFollowers = async (req, res) => {};

export const createPost = async (req, res) => {
  try {
    const { message, topic, comments, likes, createdBy, media }: IPost =
      req.body;

    const newPost = new Post({
      message,
      topic,
      comments,
      likes,
      createdBy,
      media,
    });

    newPost.Save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, topic, comments, likes, createdBy, media }: IPost =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(POST_NOT_FOUND);

    const updatedPost = {
      createdBy,
      topic,
      message,
      comments,
      likes,
      media,
      _id: id,
    };

    await Post.findByIdAndUpdate(id, updatedPost, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(POST_NOT_FOUND);

    await Post.findByIdAndRemove(id);

    res.json({ message: POST_DELETED_SUCESS });
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { likedBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(POST_NOT_FOUND);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $push: { likes: likedBy._id } },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const {comment} = req.body

    const foundPost = await Post.findById(id);

    if (!foundPost) return res.status(404).send(POST_NOT_FOUND);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: {
        createdBy: comment.createdBy,
        comment: comment.comment
      } } },
      { new: true }
    );

    res.status(200).json(updatedPost);
    
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const getPostByID = async (req, res) => {
  try {
    const { id } = req.params;

    const foundPost = await Post.findById(id);

    if (!foundPost) return res.status(404).send(POST_NOT_FOUND);

    res.json(200).json(foundPost);
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const getPostsBySearchQuery = async (req, res) => {
  try {
    const {query} = req.params

    var foundPosts = await Post.find({
      "message": {"$regex": query, "$options":"i"},
      "topic": {"$regex": query, "$options":"i"},
      "parentPost.message": {"$regex": query, "$options":"i"},
      "parentPost.topic": {"$regex": query, "$options":"i"},
    })

    if (!foundPosts || foundPosts.length == 0)  return res.status(404).send(SEARCH_POSTS_NOT_FOUND);

    res.status(200).json(foundPosts)
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const sharePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { createdBy } = req.body;

    const originalPost = await Post.findById(id);

    if (!originalPost) return res.status(404).send(POST_NOT_FOUND);

    const newPost = new Post({
      parentPost: originalPost._id,
      createdBy,
    });

    newPost.Save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
