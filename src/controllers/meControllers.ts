import type { Request, Response } from "express"
import { AuthUser } from "../middleware/mwTypes"
import { usersContainer } from "../services/containers"
import { User } from "../type"


export const getCurrentUser = async (
    req: Request & {user: AuthUser},
    res: Response<User | {error:string}>
): Promise<void | Response<{error: string}>> => {
    try {
        const authUser: AuthUser = req.user
        const { resource: user } = await usersContainer.item(
            authUser.userId, authUser.userId).read<User>()
    
        if (!user){
            return res.status(404).json({error: 'User not found'})
        }
    
        const { password, ...userWithoutPassword }:User = user
        res.json(userWithoutPassword)
    } catch (err) {
        console.error('Get profile error ', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}
