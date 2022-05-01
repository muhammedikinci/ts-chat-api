import { LoginResponse, RegisterResponse } from "../dto/loginResponse";
import IUserRepository from "../repository/IUserRepository";
import { checkUsernameAndPassword } from "../validator";
import IUserApi from "./IUserApi";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorMessageUserNotFound } from "./Messages";

class UserApi implements IUserApi {
    repository: IUserRepository;
    
    constructor(repository: IUserRepository) {
        this.repository = repository
    }

    login = (username: string, password: string): LoginResponse => {
        const message = checkUsernameAndPassword(username, password)

        if (message != "") {
            return {
                status: false,
                message: message
            }
        }

        const result = this.repository.findByUsernameAndPassword(username, password)

        if (!result) {
            return {
                status: false,
                message: ErrorMessageUserNotFound
            }
        }

        const token = jwt.sign({ username }, config.get("private_key"));

        return {
            token,
            username
        }
    }
    register = (username: string, password: string): RegisterResponse => {
        return {
            status: false,
            message: ""
        }
    }
    
}

export default UserApi