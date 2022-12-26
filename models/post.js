import mongoose from 'mongoose'
import Comment from './comment.js'
import file from './file.js'
import User from './user.js'

const postSchema = mongoose.Schema({
    caption: String,
    message: String,
    topic: String,
    createdAt: {
        type: Date,
        default: Date()
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
})

const PostMessage = mongoose.model('Post', postSchema)

export default PostMessage