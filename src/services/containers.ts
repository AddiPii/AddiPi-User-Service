import { CONFIG } from "../config/config";
import { cosmosConnect } from "../db/cosmosConnect";


export const { 
    usersContainer,
    jobsContainer 
} = cosmosConnect(CONFIG.COSMOS_ENDPOINT, CONFIG.COSMOS_KEY)