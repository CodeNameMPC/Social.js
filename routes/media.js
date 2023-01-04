import Grid from 'gridfs-stream'
import {GridFsStorage} from 'multer-gridfs-storage'
import multer from 'multer'
import crypto from 'crypto'
import path from 'path';
import express from "express";
import { uploadMedia, deleteMedia } from '../controllers/posts';
import { getMedia } from '../controllers/media';

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
const store = multer({ storage, limits: process.env.MEDIA_FILE_SIZE_MAX });

const uploadMiddleware = (req, res, next) => {
  const upload = store.single('media')
  upload(req, res, function(error) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send('file too large')
    } else if (err) {
      if (err === 'filetype') return res.status(400).send("Invalid media format")
      return res.status(500)
    }

    next()
  })
}

router.post('/upload', uploadMiddleware, (req, res) => {
  
})
router.post('/delete', deleteMedia)
router.get(':id', getMedia)