import express from 'express'
import cors from 'cors'
import { CONFIG } from './config/config'
import { jobsRouter } from './routes/jobs'
import { meRouter } from './routes/me'
import { usersRouter } from './routes/users'
import type { Request, Response } from 'express'


const app = express()

app.use(express.json())

app.use(cors())

app.use('/users/jobs', jobsRouter)

app.use('/users/me', meRouter)

app.use('/users', usersRouter)

app.get('/health', (req: Request, res: Response<{ok: boolean}>): void => {
    res.json({ ok: true });
});

app.use((req: Request, res: Response<{error: string}>): void => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(CONFIG.PORT, (): void => {
    console.log(`Server listening on port: ${CONFIG.PORT}`)
})
