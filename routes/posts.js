import express from "express";
import {
  getAllPosts,
  createPost,
  getPostsByUser,
  getPostsForUsersFollowers,
  editPost,
  likePost,
  deletePost,
  getPostByID,
  getPostsBySearchQuery,
  sharePost
} from "../controllers/posts";
import {
  postComment,
  getCommentsForPost,
  getComment,
  likeComment,
  replyToComment,
  deleteComment
} from '../controllers/comments'
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
router.post("/:id/share", sharePost)
router.get("/id/comments/", getCommentsForPost)
router.get("/:postid/comments/:commentid", getComment)
router.post("/:id/comments/postComment", postComment)
router.patch("/:postid/comments/:commentid/like", likeComment)
router.post("/:postid/comments/:commentid/reply", replyToComment)
router.delete("/:postid/comments/:commentid/delete", deleteComment)

export default router;
