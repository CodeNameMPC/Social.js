import Post from "../models/post";
import Comment from "../models/comment";
import {
  POST_NOT_FOUND,
  COMMENTS_NOT_FOUND,
  COMMENT_NOT_FOUND,
  COMMENT_DELETE_SUCCESS
} from "../constants/errorCodes.js";

export const getCommentsForPost = async (req, res) => {
  try {
    const { id } = req.params;

    const foundPost = await Post.findById(id);

    if (!foundPost) return res.status(404).send(POST_NOT_FOUND);

    if (!foundPost.comments || foundPost.comments.length === 0)
      return res.status(404).send(COMMENTS_NOT_FOUND);

    return res.stauts(200).json(foundPost.comments);
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const getComment = async (req, res) => {
  try {
    const { postid, commentid } = req.params;

    const foundPost = await Post.findById(postid);

    if (!foundPost) return res.status(404).send(POST_NOT_FOUND);

    const foundComment = await Comment.findById(commentid);

    if (!foundComment) return res.status(404).send(COMMENT_NOT_FOUND);

    return res.status(200).json({ foundPost, foundComment });
  } catch (error) {}
};

export const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const foundPost = await Post.findById(id);

    if (!foundPost) return res.status(404).send(POST_NOT_FOUND);

    const newComment = await Comment.create({
      createdBy: comment.createdBy,
      comment: comment.comment,
    });

    newComment.Save();

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.status(200).json({ updatedPost, newComment });
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { postid, commentid } = req.params;
    const { likedBy } = req.body;

    const foundComment = await Comment.findById(commentid);

    if (!foundComment) return res.status(404).send(COMMENT_NOT_FOUND);

    const updatedComment = await Post.findByIdAndUpdate(
      commentid,
      { $push: { likes: likedBy._id } },
      { new: true }
    );

    const foundPost = await Post.findById(postid);

    if (!foundPost) return res.status(404).send(POST_NOT_FOUND);

    return res.status(200).json({ foundPost, updatedComment });
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const replyToComment = async (req, res) => {
  try {
    const { postid, commentid } = req.params;
    const { reply } = req.body;

    const foundPost = await Post.findById(postid);

    if (!foundPost) return res.status(404).send(POST_NOT_FOUND);

    const foundComment = await Comment.findById(commentid);

    if (!foundComment) return res.status(404).send(COMMENT_NOT_FOUND);

    const replyComment = await Comment.create({
      createdBy: reply.createdBy,
      comment: reply.comment,
      parentComment: foundComment._id,
    });

    replyComment.Save();

    return res.status(200).json({ foundComment, replyComment });
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postid, commentid } = req.params;

    const foundPost = await Post.findById(postid);

    if (!foundPost) return res.status(404).send(POST_NOT_FOUND);

    const foundComment = await Comment.findById(commentid);

    if (!foundComment) return res.status(404).send(COMMENT_NOT_FOUND);

    const updatedPost = Post.updateOne(
      { _id: postid },
      { $pull: { comments: { _id: commentid } } },
      { upsert: false, multi: false }
    );

    // Delete the parent comment
    Comment.deleteOne({ _id: commentid });
    // Delete all the comments replying to this parent
    Comment.deleteMany({ parentComment: commentid });

    return res.status(200).json({message: COMMENT_DELETE_SUCCESS, updatedPost})
  } catch (error) {
    req.status(500).json({ message: error.message });
  }
};
