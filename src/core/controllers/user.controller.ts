import IController from "../controller";

export default interface IUserController extends IController {
    LogIn(req: any, res: any): any;
    ChangePassword(req: any, res: any): any;
}