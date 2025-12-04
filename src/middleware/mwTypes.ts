export type AuthUser = {
    userId: string,
    email: string,
    role: "admin" | "user"
}

export type Data = {
    valid: 'true' | 'false',
    user: AuthUser
}
