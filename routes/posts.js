import express from 'express'
import { getAllPosts, createPost, uploadMedia } from '../controllers/posts'
import auth from '../middleware/auth.js'

import Grid from 'gridfs-stream'
import {GridFsStorage} from 'multer-gridfs-storage'
import multer from 'multer'
import crypto from 'crypto'
import path from 'path';

const router = express.Router()



var storage = new GridFsStorage({
  url: process.env.CONNECTION_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

//router.get('/search', getPostsBySearch)
router.get('/getAll', getAllPosts)
router.post('/', auth, createPost)
router.post('/media/upload', upload.single('file'), uploadMedia)
// router.patch('/:id', auth, updatePost)
// router.delete('/:id', auth, deletePost)
// router.patch('/:id/likePost', auth, likePost)
//router.get('/:id', getPost)
// router.post('/:id/commentPost', auth, commentPost)
// router.post('/:id/comments', getComments)

export default router;