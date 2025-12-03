import express from 'express'
import type { Router } from 'express'
import { getAllUsers } from '../controllers/usersControllers'


export const usersRouter: Router = express.Router()

usersRouter.get('/', getAllUsers)
