import { usersContainer, jobsContainer } from '../services/containers'
import type { Request, Response } from 


export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void | Response<{error: string}>>=> {
    try {
        const query = 'SELECT * FROM c'
        
        const { resources: users } = await usersContainer.items.query(query)
    } catch (error) {
        console.error('Get all users error ', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}