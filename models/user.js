import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    _id: Number,
    _type: String,
    userName: String,
    image: String,
    biography: String,
    website: String,
    verified: Boolean,
    followers: [{type: String}],
    following: [{type: String}]
})

const User = mongoose.model('User', userSchema)

export default User