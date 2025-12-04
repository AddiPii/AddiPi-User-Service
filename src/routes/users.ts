import express from 'express'
import type { Router } from 'express'
import { deleteUser, getAllUsers, getUserById, updateUserRole, updateUserRoleByParams } from '../controllers/usersControllers'
import requireAuth from '../middleware/requireAuth'
import requireAdmin from '../middleware/requireAdmin'


export const usersRouter: Router = express.Router()

usersRouter.get('/', requireAuth, requireAdmin, getAllUsers)

usersRouter.get('/:userId', requireAuth, requireAdmin, getUserById)

usersRouter.patch('/:userId/role/:role', requireAuth, requireAdmin, updateUserRoleByParams)

usersRouter.patch('/:userId/role', requireAuth, requireAdmin, updateUserRole)

usersRouter.delete('/:userId', requireAuth, requireAdmin, deleteUser)
