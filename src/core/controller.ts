import { Request, Response } from "express-serve-static-core";

export default interface IController {
    Create(req: Request, res: Response): any;
    Update(req: Request, res: Response): any;
    Delete(req: Request, res: Response): any;
    GetAll(req: Request, res: Response): any;
    GetById(req: Request, res: Response): any;
}