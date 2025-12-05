import express from 'express'
import type { Router } from 'express'
import { deleteJobById, getCompletedJobs, getUpcommingJobs } from '../controllers/jobControllers'
import requireAuth from '../middleware/requireAuth'


export const jobsRouter: Router = express.Router()

jobsRouter.get('/upcomming', requireAuth, getUpcommingJobs)

jobsRouter.get('/recent-completed', requireAuth, getCompletedJobs)

jobsRouter.delete('/:jobId', deleteJobById)
