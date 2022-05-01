import { LoginResponse, RegisterResponse } from "../dto/loginResponse";

interface UserApi {
    login(username: string, password: string): LoginResponse
    register(username: string, password: string): RegisterResponse
}

const userApi: UserApi = {
    login: function (username: string, password: string): LoginResponse {
        throw new Error("Function not implemented.");
    },
    register: function (username: string, password: string): RegisterResponse {
        throw new Error("Function not implemented.");
    }
}

export default userApi