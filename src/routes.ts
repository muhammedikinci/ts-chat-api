import { Router } from "express";
import userController from "./controller/user.controller";

const router = Router();

router.get('/login', userController.login)
router.get('/register', userController.register)

export default router;