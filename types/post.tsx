import {IUser} from './user'

export interface IPost {
  message: String,
  topic: String,
  comments: {
    createdBy: IUser,
    comment: String,
  }[],
  likes: IUser[],
  createdAt: Date,
  createdBy: IUser,
  media: String[], // Maybe
  parentPost: IPost // used if a post is shared
}