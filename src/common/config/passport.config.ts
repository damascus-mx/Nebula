/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Configures PassportJS module
 */

import passport from "passport";
import passportLocal from "passport-local";
import passportFacebook from "passport-facebook";
import { UserRepository } from '../../infrastructure/repositories/user.repository'
import { AuthService } from "../../services/auth.service";
import IUserRepository from "../../core/repositories/user.repository";
import { Sequelize } from "sequelize";
import { IUser } from "../../domain/models/user.model";
import { SHA256 } from 'crypto-js';
import bcrypt from 'bcryptjs';
import { Request } from "express";

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const _userRepository: IUserRepository = new UserRepository();

export default () => {
    passport.serializeUser<any, any>((user, done) => {
        done(undefined, user.id);
    });
    
    passport.deserializeUser<any, any>((id, done) => {
        _userRepository.GetById(id).then(user => done(null, user)).catch(e => done(e, false));
    });
    
    /**
     * Sign in using username and password.
     */
    passport.use(new LocalStrategy((username, password, done) => {
        _userRepository.FindOne(Sequelize.or({ username: username.toLowerCase() }, { email: username.toLowerCase() })).then(async (user) => {
            if (!user) return done(undefined, false, { message: 'User not found' })
            return await AuthService.verifyPassword(password, user.password) ? done(undefined, user) : done(undefined, false, { message: "Invalid username or password." });
        })
        .catch(e => done(e));
    }));

    /*
    *   -   Sign up
    *   -   Sign in with already associated facebook account
    *   -   Logged user facebook integration
    */
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID || 'null',
        clientSecret: process.env.FACEBOOK_SECRET || 'null',
        callbackURL: '/api/v1/connect/facebook/callback',
        profileFields: ["name", "email", "picture", "link", "displayName", "location", "friends"],
        passReqToCallback: true
    }, async (req: Request, accessToken: string, refreshToken: string, profile: any, done) => {
        try {
            const user = await _userRepository.FindOne({oauth_id: profile.id});

            // Logged
            if (req.user) {

            } else {
                
                if (user) return done(null, user);
                else {
                    const newUser: IUser = {
                        username: SHA256(profile.id).toString().substring(0, 25),
                        password: await bcrypt.hash(SHA256(profile.id).toString().substring(0, 20), 10),
                        email: profile.emails[0].value,
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        image: `https://graph.facebook.com/${profile.id}/picture?type=large`,
                        country: 'us',
                        domain: 'facebook',
                        oauth_id: profile.id
                    }

                    try {
                        const response: any = await _userRepository.Create(newUser);

                        !response.errors ? done(null, response) : done(response.errors[0], null);
                    } catch (error) {
                        done(error, null)
                    }
                }
            }
            
        } catch (error) {
            return done(error);
        }
    }));
}