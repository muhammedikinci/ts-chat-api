import { Request, Response } from "express";

interface IUserController {
    register(req: Request, res: Response): Promise<void>
    login(req: Request, res: Response): Promise<void>
}

export default IUserController