import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import User from '../models/user.js'

dotenv.config()


export const createOrGet = async (req, res) => {
    const { _id, _type, userName, image } = req.body

    try {
        const user = await User.updateOne({_id}, {
            $setOnInsert: {_id, name: userName, image},
            $set: {userName: userName}
        }, {upsert: true})

        res.status(200).json(user)

    } catch (error) {
       console.log(error)
    }
}

export const getUserByID = async(req,res) => {
    const {id} = req.params
    try {
        const result = await User.findById(id)

        console.log(result)

        if(!result) res.status(400).json({message: "User not found"})

        res.status(200).json(result)
    } catch (error) {
        console.log("whoops")
    }
}