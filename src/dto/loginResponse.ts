type SuccessfulLoginResponse = {
    username: String,
    token: String,
}

type DynamicResponse = {
    status: boolean,
    message: String,
}

type LoginResponse = SuccessfulLoginResponse | DynamicResponse
type RegisterResponse = DynamicResponse

export { LoginResponse, RegisterResponse, SuccessfulLoginResponse, DynamicResponse }