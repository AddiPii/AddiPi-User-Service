import express from 'express'
import type { Router } from 'express'
import { getUpcommingJobs } from '../controllers/jobControllers'


export const jobsRouter: Router = express.Router()

jobsRouter.get('/upcomming', getUpcommingJobs)
