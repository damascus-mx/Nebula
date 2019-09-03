/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Sets UserController actions
 */

import IController from "../controller";
import { Request, Response } from "express-serve-static-core";

export default interface IUserController extends IController {
    LogIn(req: Request, res: Response): any;
    ChangePassword(req: Request, res: Response): any;
    ForceChangePassword(req: Request, res: Response): any;
    UploadProfilePicture(req: Request, res: Response): any;
    ForceSignIn(req: Request, res: Response): any;
    Facebook(req: Request, res: Response): any;
    FacebookCallback(req: Request, res: Response): any;
    Google(req: Request, res: Response): any;
    GoogleCallback(req: Request, res: Response): any;
}