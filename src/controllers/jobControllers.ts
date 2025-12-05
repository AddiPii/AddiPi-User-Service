import type { Request, Response } from "express";
import { jobsContainer } from "../services/containers";
import { Job } from "../type";


export const getUpcommingJobs = async (
    req: Request,
    res: Response<{ jobs: Array<Job>, count: number } | {error: string}>
): Promise<void> => {
    try {
        const query: string = `
            SELECT * FROM c WHERE
            c.status IN ('scheduled', 'pending')
            ORDER BY c.scheduledAt ASC
            `
        
        const { resources: jobs } = await jobsContainer.items.query(query).fetchAll()
        
        res.json({ jobs, count: jobs.length })
    } catch (err) {
        console.log('Get upcoming jobs error:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


export const getCompletedJobs = async (
    req: Request<{}, unknown, {}, { limit: string }>,
    res: Response<{ jobs: Array<Job>, count: number } | { error: string }>
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
        
        res.json({jobs, count: jobs.length})
    } catch (err) {
        console.log('Get recent completed jobs error:', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}


export const deleteJobById = async (
    req: Request,
    res: Response<{ message: string } | { error: string }>
): Promise<void | Response<{ error: string }>> => {
    try {
        const { jobId } = req.params
    
        const query = `SELECT * FROM c WHERE c.id = @jobId`
        const { resources } = await jobsContainer.items.query({
            query,
            parameters: [{ name: '@jobId', value: jobId }]
        }).fetchAll()
    
        if (resources.length === 0) {
            return res.status(404).json({error: 'Job not found'})
        }
    
        await jobsContainer.item(jobId, jobId).delete()
    
        res.json({ message: 'Job deleted successfully' })
    } catch (err) {
        console.log('Delete job error ', err)
        res.status(500).json({ error: 'Internal server error' })
    }
}
