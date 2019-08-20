import IController from "../controller";
import { Request, Response } from "express-serve-static-core";

export default interface IUserController extends IController {
    LogIn(req: Request, res: Response): any;
    ChangePassword(req: Request, res: Response): any;
    Facebook(req: Request, res: Response): any;
    FacebookCallback(req: Request, res: Response): any;
}