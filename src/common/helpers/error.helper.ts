import { Request, Response, NextFunction } from 'express';

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
    switch(err.name) {
        case 'UnauthorizedError':
            return res.status(401).send({message: err.message});
        
    }

    next();
}