/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports a generic controller with basic actions
 */

import { Request, Response } from "express-serve-static-core";

export default interface IController {
    Create(req: Request, res: Response): any;
    Update(req: Request, res: Response): any;
    Delete(req: Request, res: Response): any;
    GetAll(req: Request, res: Response): any;
    GetById(req: Request, res: Response): any;
}