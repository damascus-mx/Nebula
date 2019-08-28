/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Configures PassportJS module
 */

// Passport 
import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import passportGoogle from "passport-google-oauth";

// Interfaces
import IUserRepository from "../../core/repositories/user.repository";
import { IPassportConfig } from "../../core/config/passport.interface";
import { IAuthService } from "../../core/services/auth.interface";

// Misc
import { Sequelize } from "sequelize";
import Config from './';
import { Request } from "express";
import { ProviderEnum } from "../enums/provider.enum";
import { TYPES } from "./types";

// DI IoC
import { injectable, inject } from "inversify";


@injectable()
export class PassportConfig implements IPassportConfig {
    private static _userRepository: IUserRepository;
    private static _authService: IAuthService;

    private readonly LocalStrategy = passportLocal.Strategy;
    private readonly FacebookStrategy = passportFacebook.Strategy;
    private readonly GoogleStrategy = passportGoogle.OAuth2Strategy;

    constructor(@inject(TYPES.AuthService) authService: IAuthService, @inject(TYPES.UserRepository) userRepository: IUserRepository){
        PassportConfig._userRepository = userRepository;
        PassportConfig._authService = authService;
        
        passport.serializeUser<any, any>((user, done) => {
            done(undefined, user.id);
        });
        
        passport.deserializeUser<any, any>((id, done) => {
            PassportConfig._userRepository.GetById(id).then(user => done(null, user)).catch(e => done(e, false));
        });
        
        /**
         * Sign in using username and password.
         */
        passport.use(new this.LocalStrategy((user, password, done) => {
            PassportConfig._userRepository.FindOne(Sequelize.or({ username: user.toLowerCase() }, { email: user.toLowerCase() })).then(async (user) => {
                if (!user) return done(undefined, false, { message: 'User not found' })
                return await PassportConfig._authService.verifyPassword(password, user.password) ? done(undefined, user) : done(undefined, false, { message: "Invalid username or password." });
            })
            .catch(e => done(e));
        }));
    
        /*
        *   -   Sign up
        *   -   Sign in with already associated facebook account
        *   -   Logged user facebook integration
        */
        passport.use(new this.FacebookStrategy({
            clientID: Config.facebook.APP_ID,
            clientSecret: Config.facebook.APP_SECRET,
            callbackURL: '/api/v1/connect/facebook/callback',
            profileFields: ["name", "email", "picture", "link", "displayName", "location", "friends"],
            passReqToCallback: true
        }, (req: Request, accessToken: string, refreshToken: string, profile: any, done) => { PassportConfig._authService.handleOAuth2(req, accessToken, refreshToken, profile, done, ProviderEnum.FACEBOOK) }
        ));
    
        passport.use(new this.GoogleStrategy({
            clientID: Config.google.APP_ID || 'null',
            clientSecret: Config.google.APP_SECRET || 'null',
            callbackURL: '/api/v1/connect/google/callback',
            passReqToCallback: true
        }, (req: any, accessToken: any, refreshToken: any, profile: any, done: any ) => { PassportConfig._authService.handleOAuth2(req, accessToken, refreshToken, profile, done, ProviderEnum.GOOGLE) }
        ));
    }

    loadConfig(): void {
    }

}