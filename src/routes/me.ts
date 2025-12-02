import express from 'express'
import type { Router } from 'express'
import { getCurrentUser } from '../controllers/meControllers'
import requireAuth from '../middleware/requireAuth'


export const meRouter: Router = express.Router()


meRouter.get('/', requireAuth, getCurrentUser)