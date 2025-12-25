export interface SuccessLoginResponse {
    message: string,
    user: UserResponse,
    token: string
}
export interface UserResponse {
    name: string,
    email: string,
    role: string,
    token?: string
}
export interface FailedLoginResponse {
    message: string,
    statusMsg: string
}