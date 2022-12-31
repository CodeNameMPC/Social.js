import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    image: {type: String, required: true},
    biography: {type: String, required: false},
    website: {type: String, required: false},
    verified: {type: Boolean, required: false},
    // followers: [{type: String}],
    // following: [{type: String}],
    profileType: {type: String, required: true},
    password: {type: String, required: true}
})

const User = mongoose.model('User', userSchema)

export default User