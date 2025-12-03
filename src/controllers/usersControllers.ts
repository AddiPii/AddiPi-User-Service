import { usersContainer, jobsContainer } from '../services/containers'
import type { Request, Response } from 


export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void | Response<{error: string}>>=> {
    try {
        const limit = Math.min(Math.max(
            parseInt(req.query.limit as string || '50', 10), 1), 100)
        const query = 'SELECT * FROM c'
        
        const { resources: users } = await usersContainer.items.query(query, {
            maxItemCount: limit
        })
    } catch (error) {
        console.error('Get all users error ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}