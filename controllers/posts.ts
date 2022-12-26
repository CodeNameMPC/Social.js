
import Post from '../models/post.js'
import Grid from 'gridfs-stream'
import {GridFsStorage} from 'multer-gridfs-storage'
import mongoose from 'mongoose';

export const getAllPosts = async (req, res) => {
    try {
        const postMessages = await Post.find() //.sort({'createdAt': -1})

        // postMessages.map((post) => {
        //     post.media = getPostMedia(post.mediaId)
        // })

        console.log(postMessages)

        res.status(200).json({data: postMessages})
    } catch(error) {
       console.log(error.message)
    }
}

export const uploadMedia = (req, res) => {
    try {
        res.status(200).json(req.file)   
    } catch (error) {
        console.log(error)
    }
    
}

export const createPost = async(req, res) => {

}

const getPostMedia = async(mediaId: Number) => {
    const gfs = Grid(mongoose.connection, mongoose.mongo);
    gfs.collection("uploads");

    gfs.files.findById(mediaId, (err, file) => {
        if (!file || file.length === 0) {
            return undefined;
        }

        return file;
    })
}