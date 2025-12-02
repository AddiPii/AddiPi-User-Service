import type { Request, Response, NextFunction } from "express"


const requireAdmin = (
    req: Request & { user?: { role?: string } },
    res: Response<{error: string}>,
    next: NextFunction
): void => {
    if (!req.user || req.user.role !== 'admin'){
        res.status(403).json({error: 'Admin access required'})
        return
    }
    next()
}

export default requireAdmin
