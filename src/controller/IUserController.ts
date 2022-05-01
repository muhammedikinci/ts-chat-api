import { Request, Response } from "express";

interface IUserController {
    register(req: Request, res: Response): void
    login(req: Request, res: Response): void
}

export default IUserController