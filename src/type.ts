import type { Container } from "@azure/cosmos"

export interface configType {
    COSMOS_ENDPOINT: string,
    COSMOS_KEY: string,
    AUTH_SERVICE_URL: string,
    PORT: number
}

export type containersType = {
    usersContainer: Container,
    jobsContainer: Container
}