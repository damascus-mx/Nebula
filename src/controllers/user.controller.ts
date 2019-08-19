// Required libs
import { GENERIC_ERROR, MISSING_FIELDS, NOT_FOUND, DELETED_FIELD, UPDATED_FIELD, FAILED_AUTH, INVALID_ID } from "../common/config/app.config";
import { Request, Response } from "express-serve-static-core";
// Interfaces
import IUserController from "../core/controllers/user.controller";
import { IUser } from "../domain/models/user.model";
// Repository
import { UserRepository } from "../infrastructure/repositories/user.repository";
import IUserRepository from "../core/repositories/user.repository";

// Auth
// - Cryptographic
import { SHA3 } from 'crypto-js';
import { AuthService } from "../services/auth.service";
import passport = require("passport");
import { IVerifyOptions } from "passport-local";
import { NextFunction } from "express";

export class UserController implements IUserController {
    private static _userRepository: IUserRepository;

    constructor() {
        UserController._userRepository = new UserRepository();
    }

    async Create(req: Request, res: Response) {
        try {
            const payload = req.body;

            if ( !payload.username || !payload.password || !payload.email || 
                !payload.name  || !payload.surname || !payload.country )
            return res.status(400).send({message: MISSING_FIELDS});

            const cipherText = await SHA3(payload.password).toString();

            const user: IUser = {
                username: payload.username.toLowerCase(),
                password: cipherText,
                email: payload.email.toLowerCase(),
                name: payload.name,
                surname: payload.surname,
                country: payload.country.toLowerCase()
            };

            const response: any = await UserController._userRepository.Create(user);
            !response.errors ? res.status(200).send({user: response.User.dataValues}) : res.status(400).send({message: response.errors[0].message});
        } catch (error) {
            res.status(500).send({message: GENERIC_ERROR, error: error.message});
        }

    }

    async Update(req: Request, res: Response) {
        try {
            const payload = req.body;
            if ( isNaN(Number(req.params.id)) ) return res.status(404).send({message: INVALID_ID});

            payload.username = payload.username.toLowerCase();
            payload.email = payload.email.toLowerCase();

            const response: any = await UserController._userRepository.Update(req.params.id, payload);

            !response.errors ? res.status(200).send({message: `User ${UPDATED_FIELD}`}) : res.status(400).send({message: response.errors[0].message});
        } catch (error) {
            res.status(500).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            if ( isNaN(Number(req.params.id)) ) return res.status(404).send({message: INVALID_ID});
            const response: any = await UserController._userRepository.Delete(req.params.id);
            response > 0 ? res.status(200).send({message: `User ${DELETED_FIELD}`}) : res.status(400).send({message: `User ${NOT_FOUND}`});
        } catch (error) {
            res.status(500).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async GetAll(req: Request, res: Response) {
        try {
            const users = await UserController._userRepository.GetAll();
            users && users.length > 0 ? res.status(200).send({users: users}) : res.status(404).send({message: `User ${NOT_FOUND}`});
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async GetById(req: Request, res: Response) {
        try {
            const users = await UserController._userRepository.GetById(req.params.id);
            users ? res.status(200).send({users: users}) : res.status(404).send({message: `User ${NOT_FOUND}`});
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async LogIn(req: Request, res: Response) {
        try {
            const payload = req.body;
            if ( !payload.username || !payload.password ) return res.status(404).send({message: MISSING_FIELDS});

            return passport.authenticate("local", (err: Error, user: IUser, info: IVerifyOptions) => {
                if (err) res.status(400).send({message: GENERIC_ERROR, error: err.message});

                if (!user) return res.status(404).send({message: FAILED_AUTH});

                return res.status(200).send({message: user});
            })(req, res);
            
            // res.status(400).send({message: GENERIC_ERROR});
            
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }
    
    async ChangePassword(req: Request, res: Response) {
        try {
            const payload = req.body;
            if ( !req.params.id || isNaN(Number(req.params.id)) ) return res.status(404).send({message: INVALID_ID});
            if ( !payload.old_password || !payload.new_password ) return res.status(404).send({message: MISSING_FIELDS});

            const user = await UserController._userRepository.GetById(req.params.id);
            if (!user) return res.status(404).send({message: `User ${NOT_FOUND}`});
            if ( payload.old === payload.new_password ) return res.status(400).send({message: 'New password must be different'});

            if ( AuthService.verifyPassword(payload.old_password, user.password) ) {
                UserController._userRepository.Update(user.id, {password: SHA3(payload.new_password).toString()});
                return res.status(200).send({message: user});
            }

            return res.status(400).send({message: FAILED_AUTH});

        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }
}