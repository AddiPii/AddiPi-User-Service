import { Container, CosmosClient, Database } from "@azure/cosmos";
import type { containersType } from "../type";

export function cosmosConnect(COSMOS_ENDPOINT: string, COSMOS_KEY: string): containersType{
    let usersContainer: Container
    let jobsContainer: Container

    try {
        const comsosClient: CosmosClient = new CosmosClient({ endpoint: COSMOS_ENDPOINT, key: COSMOS_KEY })
        const database: Database = comsosClient.database('addipi')
        usersContainer = database.container('users')
        jobsContainer = database.container('jobs')
    } catch (err) {
        console.error('Failed to create Cosmos DB client:', err);
        process.exit(1);
    }

    const containers: containersType = {
        usersContainer,
        jobsContainer
    }

    return containers
}
