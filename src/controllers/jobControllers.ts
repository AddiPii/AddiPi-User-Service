import type { Request, Response } from "express";
import { jobsContainer } from "../services/containers";
import { Job } from "../type";


export const getUpcommingJobs = async (
    req: Request,
    res: Response<Job[] | {error: string}>
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
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const query =  `SELECT TOP 5 * FROM c WHERE c.status = 'completed'`
    } catch (err) {
        
    }
}
