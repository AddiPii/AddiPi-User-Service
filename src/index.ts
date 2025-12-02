import express from 'express'
import cors from 'cors'
import { CONFIG } from './config/config'


const app = express()

app.use(express.json())

app.use(cors())


app.listen(CONFIG.PORT, () => {
    console.log(`Server listening on port: ${CONFIG.PORT}`)
})