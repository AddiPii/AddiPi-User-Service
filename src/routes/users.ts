import express from 'express'
import type { Router } from 'express'
import { getAllUsers } from './controllers/usersController'


export const usersRouter: Router = express.Router()

usersRouter.get('/', getAllUsers)
