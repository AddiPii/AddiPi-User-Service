import express from 'express'
import type { Router } from 'express'
import { getCurrentUser } from '../controllers/meControllers'


export const meRouter: Router = express.Router()


meRouter.get('/', getCurrentUser)