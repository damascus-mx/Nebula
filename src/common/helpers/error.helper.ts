/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Error handling operations
 */

import { Request, Response, NextFunction } from 'express';
import { GENERIC_ERROR } from '../config/app.config';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (!err) next();

    switch(err.name) {
        case 'UnauthorizedError':
            return res.status(401).send({message: err.message});
        default:
            return res.status(403).send({message: GENERIC_ERROR});
    }
}