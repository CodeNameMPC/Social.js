import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    message: String,
    topic: String,
    comments: {
        createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
        comment: String,
    }[[]],
    likes: {type: mongoose.Schema.Types.ObjectId[[]], ref: 'users'},
    createdAt: {
        type: Date,
        default: Date()
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    media: {type: mongoose.Schema.Types.ObjectId[[]], ref: 'media.files'},
    parentPost: {type: mongoose.Schema.Types.ObjectId, ref: 'posts'}
})

const PostMessage = mongoose.model('Post', postSchema)

export default PostMessage