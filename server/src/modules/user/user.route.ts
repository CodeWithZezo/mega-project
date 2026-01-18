import { Router } from "express";
import { UserController } from "./user.controller";
import cookieParser from "cookie-parser";

const router = Router();
const userController = new UserController();

router.use(cookieParser());

router.post("/signup", userController.signup);
router.post("/login", userController.login);

export default router;
