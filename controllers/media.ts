import { getFips } from "crypto"
import mongoose from "mongoose"
import Grid from 'gridfs-stream'

export const uploadMedia = (req, res) => {
  const {file} = req

  return res.send(file.id)
}

export const deleteMedia = (req, res) => {
  const {id} = req;

  if(!id || id == 'undefined') return res.status(400).seld('no media id specified')

  const _id = new mongoose.Types.ObjectId(id)

  const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName: process.env.MONGOOSE_MEDIA_BUCKET_NAME})
  

  gfs.delete(_id)
}

export const getMedia = ({params: {id}}, res) => {
  if(!id || id == 'undefined') return res.status(400).send('no image id')

  const _id = new mongoose.Types.ObjectId(id)

  const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName: process.env.MONGOOSE_MEDIA_BUCKET_NAME})

  gfs.find({_id}).toArray()
  .then(() => {
    gfs.openDownloadStream(_id).pipe(res)
  })
  .catch(() => {
    return res.status(404).send('no files exist')
  })
}