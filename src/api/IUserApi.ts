import { LoginResponse, RegisterResponse } from "../dto/loginResponse"

interface IUserApi {
    login(username: string, password: string): Promise<LoginResponse>
    register(username: string, password: string): Promise<RegisterResponse>
}

export default IUserApi