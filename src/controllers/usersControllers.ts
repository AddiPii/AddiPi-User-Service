import { Request, Response } from 'express'
import { usersContainer } from '../services/containers'
import type { User } from '../type'


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
    req: Request,
    res: Response,
): Promise<void | {error: string}> => {
    try {
        
    } catch (error) {
        console.error('Get specific user error ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
