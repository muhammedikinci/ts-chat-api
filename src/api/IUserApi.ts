import { LoginResponse, RegisterResponse } from "../dto/loginResponse"

interface IUserApi {
    login(username: string, password: string): LoginResponse
    register(username: string, password: string): RegisterResponse
}

export default IUserApi