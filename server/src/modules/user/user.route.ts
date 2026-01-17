import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

router.post("/signup", userController.signup);
router.post("/login", userController.login);

export default router;
