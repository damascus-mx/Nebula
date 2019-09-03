/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports authentication middlewares
 */

import { NextFunction, Request, Response } from "express";
import jwt from 'express-jwt';
import _ from "lodash";
import Config from '../common/config';
import { DOMAIN } from "../common/config/app.config";

/**
 * Login Required middleware.
 */
const isAuthenticated = (req: Request) => {
    return req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' ? req.headers.authorization.split(' ')[1] : null;
};

/**
 * Authorization Required middleware.
 */
const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.status(401).send({message: 'Unauthorized'});
    }
};

export default jwt({
    secret: Config.ENCRYPT_KEY,
    getToken: isAuthenticated,
    credentialsRequired: true,
    issuer: `https://${DOMAIN}`
});