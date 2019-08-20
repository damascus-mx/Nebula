import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { FAILED_AUTH } from "../common/config/app.config";

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) return res.status(403).send({message: FAILED_AUTH});

    // Decode token
    if (req.isAuthenticated()) {
        return next();
    }
    
    res.status(403).send({message: 'Session expired'});
};

/**
 * Authorization Required middleware.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split("/").slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    } else {
        res.status(401).send({message: 'Unauthorized'});
    }
};