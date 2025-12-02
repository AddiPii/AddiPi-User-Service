import { CONFIG } from "../config/config"
import type { Request, Response, NextFunction } from "express"
import { Data } from "./mwTypes"


const requireAuth = async (
    req: Request<{}, unknown, {}, {}> & {user: string},
    res: Response<{error: string}>,
    next: NextFunction
): Promise<void | {error: string}> =>{
    try {
        const token: string | undefined = req.headers.authorization?.replace('Bearer ', '')

        if (!token){
            console.log('no token')
            res.status(401).json({error: 'Missing authentication token'})
            return
        }

        const response: globalThis.Response = await fetch(`${CONFIG.AUTH_SERVICE_URL}/auth/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        const data: Data = await response.json() as Data

        if (!response.ok){
            console.log('response not ok')
            throw new Error('Authentication failed')
        }

        req.user = data.user

        next()
    } catch (err) {
        console.log('Full try fail', err)
        res.status(401).json({ error: 'Invalid authentication token' });
    }
}

export default requireAuth
