/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports role validation middlewares
 */

import { Request, Response, NextFunction } from 'express';

/**
 * @description Enables role validation
 * @param requiredRole Required role to do action
 */
export default (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let isInRole: boolean = false;
        for ( let role of requiredRoles) {
            if(req.user.role === role ) { isInRole = true; break; }
        }

        return isInRole ? next() : res.status(401).send({message: 'Action not allowed'});
    }
}