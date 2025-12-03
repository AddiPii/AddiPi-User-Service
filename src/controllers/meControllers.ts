import type { Request, Response } from "express"
import { AuthUser } from "../middleware/mwTypes"
import { usersContainer } from "../services/containers"
import { User } from "../type"
import getLocalISO from "../helpers/getLocalISO"


export const getCurrentUser = async (
    req: Request,
    res: Response<User | {error:string}>
): Promise<void | Response<{error: string}>> => {
    try {
        const authUser = (req as any).user as AuthUser
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


export const editCurrentUser = async (
    req: Request<{}, unknown, {firstName?: string, lastName?: string}>,
    res: Response<User | {error: string}>
): Promise<void | Response<{error: string}>> => {
    try {
        const  authUser: AuthUser = (req as any).user as AuthUser
        const { firstName, lastName /*, password, confirmPassword */ } = req.body
    
        const { resource: user } = await usersContainer.item(
            authUser.userId, authUser.userId).read<User>()
    
        if (!user){
            return res.status(404).json({error: 'User not found'})
        }
    
        if (firstName) user.firstName = firstName.trim()
        if (lastName) user.lastName = lastName.trim()
        user.updatedAt = getLocalISO()

        /*
        if (!password){
            return res.status(400).json({error: 'Password is required'})
        }
        else if (password != confirmPassword){
            return res.status(400).json({error: 'Passwords must be the same'})
        }
        else if (password === confirmPassword){
            user.password = password
        }
        else {
            return res.status(400).json({error: 'Invalid password'})
        }
        */
    
        await usersContainer.item(user.id, user.id).replace(user)
    
        const {password: _, ...userWithoutPassword}: User = user
        res.json(userWithoutPassword)
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
