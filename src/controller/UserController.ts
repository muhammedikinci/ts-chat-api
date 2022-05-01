import { Request, Response } from "express";
import IUserApi from "../api/IUserApi";
import IUserController from "./IUserController";

class UserController implements IUserController {
    api: IUserApi

    constructor(api: IUserApi) {
        this.api = api
    }

    register = async (req: Request, res: Response): Promise<void> => {
        const username = req.body.username
        const password = req.body.password

        res.json(await this.api.register(username, password))
    }
    login = async (req: Request, res: Response): Promise<void> => {
        const username = req.body.username
        const password = req.body.password

        res.json(await this.api.login(username, password))
    }
    
}

export default UserController;