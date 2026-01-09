import express from 'express'
import type { Router } from 'express'
import { deleteJobById, getCompletedJobs, getUpcommingJobs } from '../controllers/jobControllers'
import requireAuth from '../middleware/requireAuth'
import requireAdmin from '../middleware/requireAdmin'


export const jobsRouter: Router = express.Router()

jobsRouter.get('/upcomming', getUpcommingJobs)

jobsRouter.get('/recent-completed', getCompletedJobs)

jobsRouter.delete('/:jobId', requireAuth, requireAdmin, deleteJobById)
