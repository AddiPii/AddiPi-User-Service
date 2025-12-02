import express from 'express'
import cors from 'cors'
import { CONFIG } from './config/config'
import { jobsRouter } from './routes/jobs'
import { meRouter } from './routes/me'
import { usersRouter } from './routes/users'


const app = express()

app.use(express.json())

app.use(cors())

app.use('/users/jobs', jobsRouter)

app.use('/users/me', meRouter)

app.use('/users', usersRouter)

app.listen(CONFIG.PORT, () => {
    console.log(`Server listening on port: ${CONFIG.PORT}`)
})