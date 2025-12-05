import express from 'express'
import type { Router } from 'express'
import { getCompletedJobs, getUpcommingJobs } from '../controllers/jobControllers'


export const jobsRouter: Router = express.Router()

jobsRouter.get('/upcomming', getUpcommingJobs)

jobsRouter.get('/recent-completed', getCompletedJobs)
