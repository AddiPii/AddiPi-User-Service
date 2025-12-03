import express from 'express'
import type { Router } from 'express'
import { editCurrentUser, getCurrentUser, getCurrentUserJobs } from '../controllers/meControllers'
import requireAuth from '../middleware/requireAuth'


export const meRouter: Router = express.Router()


meRouter.get('/', requireAuth, getCurrentUser)

meRouter.patch('/', requireAuth, editCurrentUser)

meRouter.get('/jobs', requireAuth, getCurrentUserJobs)