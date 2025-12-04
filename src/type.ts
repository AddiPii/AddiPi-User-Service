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

export interface User {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    password?: string,
    role: "admin" | "user",
    isVerified: boolean,
    verificationToken?: string,
    verificationTokenExpiry?: string,
    createdAt: string,
    updatedAt: string,
    microsoftId?: string
}

export type Job = {
    id: number,
    fileId: string,
    originalFileName: string,
    userId: string,
    userEmail: string,
    status: "scheduled" | "pending" | "failed" | "completed",
    scheduledAt: string,
    createdAt: string
}