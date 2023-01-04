import express from "express";
import {
  getAllPosts,
  createPost,
  getPostsByUser,
  getPostsForUsersFollowers,
  editPost,
  likePost,
  commentOnPost,
  deletePost,
  getPostByID,
  getPostsBySearchQuery,
  sharePost
} from "../controllers/posts";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/search/:query", getPostsBySearchQuery);
router.post("/newPost", auth, createPost);
router.get("/byUser/:id", getPostsByUser);
router.get("/byUserFollowers/:id", getPostsForUsersFollowers);
router.patch("/:id", editPost);
router.delete("/:id", deletePost);
router.patch("/:id/likePost", likePost);
router.get("/:id", getPostByID);
router.post("/:id/commentPost", commentOnPost);
router.post("/:id/share", sharePost)

export default router;
