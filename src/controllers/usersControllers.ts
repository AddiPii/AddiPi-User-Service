import { usersContainer, jobsContainer } from '../services/containers'
import type { Request, Response } from 


export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void | Response<{error: string}>>=> {
    const query = 'SELECT * FROM c'
    
    const { resources: users } = await usersContainer.items.query(query)
}