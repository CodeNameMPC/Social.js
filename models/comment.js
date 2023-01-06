import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
  comment: String,
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  postedAt: {
    type: Date,
    defualt: new Date()
  },
  likes: {type: mongoose.Schema.Types.ObjectId[[]], ref: 'users'},
  parentComment: {type: mongoose.Schema.Types.ObjectId, ref: 'comment'}
})

const Comment = mongoose.model('Comment', commentSchema)

export default Comment;