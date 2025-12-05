import type { Request, Response } from "express";
import { jobsContainer } from "../services/containers";
import { Job } from "../type";


export const getUpcommingJobs = async (
    req: Request,
    res: Response<Array<Job> | {error: string}>
): Promise<void> => {
    try {
        const query: string = `
            SELECT * FROM c WHERE
            c.status IN ('scheduled', 'pending')
            ORDER BY c.scheduledAt ASC
            `
        
        const { resources: jobs } = await jobsContainer.items.query(query).fetchAll()
        
        res.json(jobs)
    } catch (err) {
        console.log('Get upcoming jobs error:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


export const getCompletedJobs = async (
    req: Request<{}, unknown, {}, { limit: string }>,
    res: Response<Array<Job> | { error: string }>
): Promise<void> => {
    try {
        const { limit } = req.query

        let query: string =  `
            SELECT TOP 5 * FROM c WHERE
            c.status = 'completed'
            ORDER BY c.updatedAt DESC
            `
        
        if (limit || typeof(limit) === 'string' || !isNaN(parseInt(limit))){
            query = query.replace('5', limit)
        }

        const { resources: jobs } = await jobsContainer.items.query(query).fetchAll()
        
        res.json(jobs)
    } catch (err) {
        console.log('Get recent completed jobs error:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}
