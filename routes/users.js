import express from 'express'

import {createOrGet, getUserByID } from '../controllers/user.js';

const router = express.Router()

router.post('/createOrGet', createOrGet)
router.get("/findById/:id", getUserByID)

export default router;