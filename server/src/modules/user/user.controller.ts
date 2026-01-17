import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  private userService: UserService;

  constructor(userService?: UserService) {
    this.userService = userService ?? new UserService();
  }

  signup = async (req: Request, res: Response) => {
    try {
      const { status, body } = await this.userService.signup(req.body);
      return res.status(status).json(body);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { status, body } = await this.userService.login(req.body);
      return res.status(status).json(body);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
