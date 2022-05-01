import { Request, Response } from "express";
import userApi from "../api/user.api";

interface UserController {
    register(req: Request, res: Response): void
    login(req: Request, res: Response): void
}

const userController: UserController = {
    register: function (req: Request, res: Response): void {
        const username = req.body.username
        const password = req.body.password

        res.json(userApi.register(username, password))
    },
    login: function (req: Request, res: Response): void {
        const username = req.body.username
        const password = req.body.password

        res.json(userApi.login(username, password))
    }
}

export default userController;