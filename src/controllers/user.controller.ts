/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Handles all user-related actions
 */

// Required libs
import { GENERIC_ERROR, MISSING_FIELDS, NOT_FOUND, DELETED_FIELD, UPDATED_FIELD, FAILED_AUTH, INVALID_ID, FAILED_CREATE } from "../common/config/app.config";
import { Request, Response } from "express";
import { check, sanitize, validationResult } from "express-validator";

// Interfaces - Implementations
import IUserController from "../core/controllers/user.controller";
import IUserService from "../core/services/user.interface";
import { IUser } from "../domain/models/user.model";

// Auth
// - OAuth2
import passport = require("passport");
import { IVerifyOptions } from "passport-local";
import { inject, injectable } from "inversify";
import { TYPES } from "../common/config/types";
import { IAuthService } from "../core/services/auth.interface";

@injectable()
export class UserController implements IUserController {
    private static _userService: IUserService;
    private static _authService: IAuthService;

    constructor(@inject(TYPES.UserService) userService: IUserService, @inject(TYPES.AuthService) authService: IAuthService ) {
        UserController._userService = userService;
        UserController._authService = authService;
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

            const user = await UserController._userService.create(payload);
            user ? res.status(200).send({user: user}) : res.status(400).send({message: `User ${FAILED_CREATE}`});

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

            const response: any = await UserController._userService.update(req.params.id, payload);

            !response.errors ? res.status(200).send({message: `User ${UPDATED_FIELD}`}) : res.status(400).send({message: response.errors[0].message});
        } catch (error) {
            res.status(500).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async Delete(req: Request, res: Response) {
        try {
            if ( isNaN(Number(req.params.id)) ) return res.status(404).send({message: INVALID_ID});
            const response = await UserController._userService.delete(req.params.id);

            response > 0 ? res.status(200).send({message: `User ${DELETED_FIELD}`}) : res.status(400).send({message: `User ${NOT_FOUND}`});
        } catch (error) {
            res.status(500).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async GetAll(req: Request, res: Response) {
        try {
            const users = await UserController._userService.getAll(req.query.limit, req.query.page);
            users.length > 0 ? res.status(200).send({users: users}) : res.status(404).send({message: `Users ${NOT_FOUND}`});
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async GetById(req: Request, res: Response) {
        try {
            const users = await UserController._userService.getById(req.params.id);
            users ? res.status(200).send({users: users}) : res.status(404).send({message: `User ${NOT_FOUND}`});
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async LogIn(req: Request, res: Response) {
        try {
            const payload = req.body;
            if ( !payload.username || !payload.password ) return res.status(404).send({message: MISSING_FIELDS});

            passport.authenticate('local', {session: false}, (err: Error, user: IUser, info: IVerifyOptions) => {
                if (err) res.status(400).send({message: GENERIC_ERROR, error: err.message});

                if (!user) return res.status(404).send({message: FAILED_AUTH});

                const jwtUser = UserController._authService.generateJWTToken(user);

                return res.status(200).send({jwt: jwtUser});
            })(req, res);

        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async ForceSignIn(req: Request, res: Response) {
        try {
            const payload = req.body;
            if ( !payload.username ) return res.status(404).send({message: MISSING_FIELDS});

            const jwtUser = await UserController._userService.forceSignIn(payload.user);
            jwtUser ? res.status(200).send({jwt: jwtUser}) : res.status(404).send({message: FAILED_AUTH});

        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }
    
    async ChangePassword(req: Request, res: Response) {
        try {
            const payload = req.body;
            if ( !req.params.id || isNaN(Number(req.params.id)) ) return res.status(404).send({message: INVALID_ID});
            if ( !payload.old_password || !payload.new_password ) return res.status(404).send({message: MISSING_FIELDS});

            const user = await UserController._userService.changePassword(req.params.id, payload);

            user ? res.status(200).send({user: user}) : res.status(400).send({message: FAILED_AUTH});

        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async ForceChangePassword(req: Request, res: Response) {
        try {
            const payload = req.body;
            if ( !payload.password || !req.params.id || isNaN(Number(req.params.id)) ) return res.status(404).send({message: MISSING_FIELDS}); 

            const user = await UserController._userService.forceChangePassword(req.params.id, payload.password);

            user ? res.status(200).send({user: user}) : res.status(400).send({message: FAILED_AUTH});

        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    /**
     *  Formidable endpoints (File uploading)
     */
    
    async UploadProfilePicture(req: Request, res: Response) {
        try {
            const uploaded = await UserController._userService.uploadProfilePicture(req);
            res.status(200).send({message: uploaded});
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
                if (err) return res.status(400).send({message: GENERIC_ERROR, error: err.message});

                if (!user) return res.status(404).send({message: FAILED_AUTH});

                return res.status(200).send({user: user});
            })(req, res);
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async Google(req: Request, res: Response) {
        try {
            passport.authenticate('google', {session: false, scope: ['profile', 'email']})(req, res);
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async GoogleCallback(req: Request, res: Response) {
        try {
            passport.authenticate('google', {session: false}, (err: Error, user: IUser, info: IVerifyOptions) => {
                if (err) return res.status(400).send({message: GENERIC_ERROR, error: err.message});

                if (!user) return res.status(404).send({message: FAILED_AUTH});

                return res.status(200).send({user: user});
            })(req, res);
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }
}