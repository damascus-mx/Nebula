// Required libs
import { GENERIC_ERROR, MISSING_FIELDS, NOT_FOUND, DELETED_FIELD, UPDATED_FIELD, FAILED_AUTH, INVALID_ID } from "../common/config/app.config";
import { Request, Response } from "express";
import { check, sanitize, validationResult } from "express-validator";

// Interfaces
import IUserController from "../core/controllers/user.controller";
import { IUser } from "../domain/models/user.model";
// Repository
import { UserRepository } from "../infrastructure/repositories/user.repository";
import IUserRepository from "../core/repositories/user.repository";

// Auth
// - Cryptographic
import bcrypt from 'bcryptjs';
import { AuthService } from "../services/auth.service";
import passport = require("passport");
import { IVerifyOptions } from "passport-local";

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

            check("email", 'Email is not valid').isEmail();
            check("password", 'Password cannot be blank').isLength({min: 1});
            sanitize("email").normalizeEmail({ gmail_remove_dots: false });

            const errors = validationResult(req);

            if(!errors.isEmpty()) return res.status(400).send({errors: errors.array()});

            const cipherText = await bcrypt.hash(payload.password, 10);

            const user: IUser = {
                username: payload.username.toLowerCase(),
                password: cipherText,
                email: payload.email.toLowerCase(),
                name: payload.name,
                surname: payload.surname,
                country: payload.country.toLowerCase()
            };

            const response: any = await UserController._userRepository.Create(user);
            !response.errors ? res.status(200).send({user: response}) : res.status(400).send({message: response.errors[0].message});
        } catch (error) {
            res.status(500).send({message: GENERIC_ERROR, error: error.message});
        }

    }

    async Update(req: Request, res: Response) {
        try {
            const payload = req.body;
            if ( isNaN(Number(req.params.id)) ) return res.status(404).send({message: INVALID_ID});
            if (payload.password) return res.status(403).send({message: 'This action is not allowed. Consider using Change Password endpoint.'});

            sanitize("email").normalizeEmail({ gmail_remove_dots: false });

            if (payload.username)   payload.username = payload.username.toLowerCase();
            if (payload.email)  payload.email = payload.email.toLowerCase();

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
            users && users.length > 0 ? res.status(200).send({users: users}) : res.status(404).send({message: `Users ${NOT_FOUND}`});
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

            passport.authenticate("local", {session: false}, (err: Error, user: IUser, info: IVerifyOptions) => {
                if (err) res.status(400).send({message: GENERIC_ERROR, error: err.message});

                if (!user) return res.status(404).send({message: FAILED_AUTH});

                return res.status(200).send({user: user});
            })(req, res);

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

            if ( await AuthService.verifyPassword(payload.old_password, user.password) ) {
                const cipherText = await bcrypt.hash(payload.new_password, 10);
                UserController._userRepository.Update(user.id, {password: cipherText});
                return res.status(200).send({message: user});
            }

            return res.status(400).send({message: FAILED_AUTH});

        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    /**
     * OAuth2 Helpers / Callbacks
     */

    async Facebook(req: Request, res: Response) {
        try {
            passport.authenticate('facebook', { scope: ['email', 'public_profile'] } )(req, res);
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async FacebookCallback(req: Request, res: Response) {
        try {
            passport.authenticate('facebook', {session: false}, (err: Error, user: IUser, info: IVerifyOptions) => {
                if (err) res.status(400).send({message: GENERIC_ERROR, error: err.message});

                if (!user) return res.status(404).send({message: FAILED_AUTH});

                return res.status(200).send({user: user});
            })(req, res);
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }
}