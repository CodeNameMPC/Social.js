import express from 'express'

import {create, update, login, getUserByID } from '../controllers/user.js';

const router = express.Router()

router.post('/create', create)
router.post('/update', update)
router.post('/login', emailLogin)
router.get("/:id", getUserByID)

export default router;