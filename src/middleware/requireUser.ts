import type { Request, Response, NextFunction } from "express"


const requireUser = (
    req: Request & { user: string},
    res: Response<{error: string}>,
    next: NextFunction
): void => {
    if (!req.user){
        res.status(403).json({error: 'Authentication required'})
        return
    }

    next()
}

export default requireUser
