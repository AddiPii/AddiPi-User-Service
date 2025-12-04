import express from 'express'
import type { Router } from 'express'
import { getAllUsers } from '../controllers/usersControllers'
import requireAuth from '../middleware/requireAuth'
import requireAdmin from '../middleware/requireAdmin'


export const usersRouter: Router = express.Router()

usersRouter.get('/', requireAuth, requireAdmin, getAllUsers)
