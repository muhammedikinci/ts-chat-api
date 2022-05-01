import { LoginResponse, RegisterResponse } from "../dto/loginResponse";
import IUserRepository from "../repository/IUserRepository";
import { checkUsernameAndPassword } from "../validator";
import IUserApi from "./IUserApi";
import jwt from "jsonwebtoken";
import config from "../config";
import { ErrorMessageUserCannotAdded, ErrorMessageUsernameExists, ErrorMessageUserNotFound, SuccessMessageUserAdded } from "./Messages";

class UserApi implements IUserApi {
    repository: IUserRepository;
    
    constructor(repository: IUserRepository) {
        this.repository = repository
    }

    login = async (username: string, password: string): Promise<LoginResponse> => {
        const message = checkUsernameAndPassword(username, password)

        if (message != "") {
            return {
                status: false,
                message: message
            }
        }

        const result = await this.repository.findByUsernameAndPassword(username, password)

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

    register = async (username: string, password: string): Promise<RegisterResponse> => {
        const message = checkUsernameAndPassword(username, password)

        if (message != "") {
            return {
                status: false,
                message: message
            }
        }

        const checkUsername = await this.repository.findByUserName(username)

        if (checkUsername) {
            return {
                status: false,
                message: ErrorMessageUsernameExists
            }
        }

        const result = await this.repository.registerUser(username, password)

        if (!result) {
            return {
                status: false,
                message: ErrorMessageUserCannotAdded
            }
        }

        return {
            status: true,
            message: SuccessMessageUserAdded
        }
    }
    
}

export default UserApi