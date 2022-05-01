import { Router } from "express";
import UserApi from "./api/UserApi";
import UserController from "./controller/UserController";
import UserRepository from "./repository/UserRepository";

const router = Router();

const userRepository = new UserRepository();
const userApi = new UserApi(userRepository);
const userController = new UserController(userApi);

router.post('/login', userController.login)
router.post('/register', userController.register)

export default router;