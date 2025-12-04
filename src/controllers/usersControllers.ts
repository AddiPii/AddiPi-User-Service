import { Request, Response } from 'express'
import { usersContainer } from '../services/containers'
import type { User } from '../type'
import getLocalISO from '../helpers/getLocalISO'
import { AuthUser } from '../middleware/mwTypes'


export const getAllUsers = async (
    req: Request<{}, unknown, {}, {sort: string, limit: string}>,
    res: Response<{error: string} | {users: Array<User>, count: number}>
): Promise<void | Response<{error: string}>> => {
    try {
        const { sort }: { sort: string | undefined } = req.query

        const limit: number = Math.min(Math.max(
            parseInt(req.query.limit as string || '50', 10), 1), 100)
        let query: string = 'SELECT * FROM c ORDER BY c.createdAt'

        if ( sort === "ASC" || sort === "asc" ){
            query += " ASC"
        } else {
            query += " DESC"
        }
        
        const { resources: users } = await usersContainer.items.query(query, {
            maxItemCount: limit
        }).fetchAll()

        const usersWithoutPassword: Array<User> = users.map((u: User): User => {
            const { password, ...userWithoutPassword } = u
            return userWithoutPassword
        })
        
        res.json({ users: usersWithoutPassword, count: usersWithoutPassword.length})

    } catch (error) {
        console.error('Get all users error ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}


export const getUserById = async (
    req: Request<{userId: string}>,
    res: Response<{error: string} | User>,
): Promise<void | Response<{error: string}>> => {
    try {
        const { userId }: {userId: string} = req.params
        const { resource: user } = await usersContainer.item(userId, userId).read<User>()

        if (!user){
            return res.status(404).json({error: 'User not found'})
        }

        const { password, ...userWithoutPassword }: User = user

        res.json(userWithoutPassword)
    } catch (err) {
        console.error('Get specific user error ', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


export const updateUserRole = async (
    req: Request<{userId: string}, unknown, {role: 'user' | 'admin'}, {}>,
    res: Response<{ error: string } | User>
):Promise<void | Response<{error: string}>> => {
    try {
        const { userId } = req.params
        const { role } = req.body

        if (!role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({error: 'Invalid role'})
        }

        const { resource: user } = await usersContainer.item(userId, userId).read<User>()

        if (!user){
            return res.status(404).json({ error: 'User not found' })
        }

        user.role = role
        user.updatedAt = getLocalISO()

        await usersContainer.item(user.id, user.id).replace(user)

        const { password, ...userWithoutPassword }: User = user
        res.json(userWithoutPassword)
    } catch (err) {
        console.error('Update user role error ', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


export const updateUserRoleByParams = async (
    req: Request<{userId: string, role: 'user' | 'admin'}, unknown, {}, {}>,
    res: Response<{ error: string } | User>
):Promise<void | Response<{error: string}>> => {
    try {
        const { userId, role } = req.params
        
        if (!role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({error: 'Invalid role'})
        }

        const { resource: user } = await usersContainer.item(userId, userId).read<User>()

        if (!user){
            return res.status(404).json({ error: 'User not found' })
        }

        user.role = role
        user.updatedAt = getLocalISO()

        await usersContainer.item(user.id, user.id).replace(user)

        const { password, ...userWithoutPassword }: User = user
        res.json(userWithoutPassword)
    } catch (err) {
        console.error('Update user role error ', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


export const deleteUser = async (
    req: Request,
    res: Response
): Promise<void | Response<{error:string}>> => {
    const { userId } = req.params
    const authUser = (req as any).user as AuthUser

    if (userId === authUser.userId){
        return res.status(400).json({ error: 'Cannot delete your own account' })
    }

    await usersContainer.item(userId, userId).delete()
    res.json({ message: 'User deleted successfully' })
}
