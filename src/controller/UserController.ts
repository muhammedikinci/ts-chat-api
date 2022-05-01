import { Request, Response } from "express";
import IUserApi from "../api/IUserApi";
import IUserController from "./IUserController";

class UserController implements IUserController {
    api: IUserApi

    constructor(api: IUserApi) {
        this.api = api
    }

    register = (req: Request, res: Response): void => {
        const username = req.body.username
        const password = req.body.password

        res.json(this.api.register(username, password))
    }
    login = (req: Request, res: Response): void => {
        const username = req.body.username
        const password = req.body.password

        res.json(this.api.login(username, password))
    }
    
}

export default UserController;