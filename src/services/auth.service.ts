/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Handles all authentication-required operations
 */

import bcrypt from 'bcryptjs';
import { Request } from 'express';
import IUserRepository from '../core/repositories/user.repository';
import { ITokenRepository } from '../core/repositories/token.repository';
import { IToken } from '../domain/models/token.model';
import { IUser } from '../domain/models/user.model';
import { SHA256 } from 'crypto-js';
import jwt from 'jsonwebtoken';
import Config from '../common/config';
import { APP_NAME, FAILED_CREATE, JWT_EXPIRATION, DOMAIN } from '../common/config/app.config';
import { injectable, inject } from 'inversify';
import { TYPES } from '../common/config/types';
import { IMailHelper } from '../core/helpers/mail.interface';
import { IAuthService } from '../core/services/auth.interface';

@injectable()
export class AuthService implements IAuthService {
    private static _userRepository: IUserRepository;
    private static _tokenRepository: ITokenRepository;
    private static _mailHelper: IMailHelper;

    constructor(
        @inject(TYPES.MailHelper) mailHelper: IMailHelper,
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.TokenReposity) tokenRepository: ITokenRepository
    ) {
        AuthService._mailHelper = mailHelper;
        AuthService._tokenRepository = tokenRepository;
        AuthService._userRepository = userRepository;
    }

    /**
     * @description Verifies password using bcrypt algorithm
     * @param password Plain password to compare
     * @param cipher Hashed password
     * @returns Boolean within Promise
     */
    public async verifyPassword(password: string, cipher: string): Promise<boolean> {
        return bcrypt.compare(password, cipher)
        .then(result => result)
        .catch(e => false);
    }

    /**
     * @description Generates JWT Token
     * @param payload Data to encode
     */
    public generateJWTToken(payload: string | object | Buffer): string {
        return jwt.sign(payload, Config.ENCRYPT_KEY, { expiresIn: JWT_EXPIRATION, issuer: `https://${DOMAIN}` });
    }
    
    /**
     * @description Handles login / sign up OAuth2 operations
     * @param req Passed express request
     * @param accessToken Access token granted by provider
     * @param refreshToken Refresh token by provider
     * @param profile Passport's profile and raw data
     * @param done Passport's callback
     * @param provider Provider type
     * @returns Promise
     */
    public async handleOAuth2(req: Request, accessToken: string, refreshToken: string, profile: any, done: any, provider: string): Promise<any> {

        try {
            const user = await AuthService._userRepository.FindOne({oauth_id: profile.id});

            // User logged
            if (req.user) {
                // User granted exists
                if (user) {
                    // Verify logged user's id
                    if ( user.id === req.user.id ) {
                        // Refresh token and return user
                        try {
                            const lastToken = await AuthService._tokenRepository.GetById(user.id);
        
                            const token: IToken = {
                                kind: provider,
                                access_token: accessToken,
                                fk_user: user.id || 0,
                                updated_at: new Date()
                            }
        
                            return lastToken ?  AuthService._tokenRepository.Update(lastToken.id, token).then(token => done(null, user)).catch(e => done(e, null)) : 
                            AuthService._tokenRepository.Create(token).then(token => done(null, user) ).catch(e => done(e, null));
        
                        } catch (error) {
                            throw error;
                        }
                    } else {
                        throw new Error(`${provider} account is already associated with another account`);
                    }
                }
                else {
                    // User logged doesnt has an oauth2 provider -  attach it to user
                    let custom_image = null;
                    if (provider === 'facebook') custom_image = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    
                    const updatedUser: any = {
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        image: custom_image || profile.photos[0].value,
                        domain: provider,
                        oauth_id: profile.id,
                        updated_at: new Date()
                    }
    
                    try {
                        const response: any = await AuthService._userRepository.Update(req.user.id, updatedUser);

                        if ( !response.errors ) {
                            // Send email
                            const message = `Hello, ${updatedUser.name}.\n\nYour account (${response.username}) has been linked succesfuly to your ${provider} account.\n`+
                            `You may now log in with your ${provider} account.\n\nThank you for using ${APP_NAME}.\nSincerely,\n ${APP_NAME}'s Team`;
                            
                            AuthService._mailHelper.sendMail([response.email], APP_NAME.toLowerCase(), `Successfuly linked your ${provider} account`, message, APP_NAME )
                            .then(success => success)
                            .catch(e => e);

                            const token: IToken = {
                                kind: provider,
                                access_token: accessToken,
                                fk_user: response.id || 0
                            };

                            AuthService._tokenRepository.Create(token).then(token => done(null, response) ).catch(e => new Error(e));
                            
                        } else done(response.errors[0], null);

                    } catch (error) {
                        throw error;
                    }
                }
            } else {
                // User granted exists - refresh token and return user    
                if (user) {
    
                    try {
                        const lastToken = await AuthService._tokenRepository.GetById(user.id);
    
                        const token: IToken = {
                            kind: provider,
                            access_token: accessToken,
                            fk_user: user.id || 0,
                            updated_at: new Date()
                        }
    
                        return lastToken ?  AuthService._tokenRepository.Update(lastToken.id, token).then(token => done(null, user)).catch(e => done(e, null)) : 
                        AuthService._tokenRepository.Create(token).then(token => done(null, user) ).catch(e => done(e, null));
    
                    } catch (error) {
                        throw error;
                    }
                }
                else {
                    // User granted doesnt exists - create user with accesstoken claims
                    let custom_image = null;
                    if (provider === 'facebook') custom_image = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    
                    const newUser: IUser = {
                        username: SHA256(profile.id).toString().substring(0, 25),
                        password: await bcrypt.hash(SHA256(profile.id).toString().substring(0, 10), 10),
                        email: profile.emails[0].value,
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        image: custom_image || profile.photos[0].value,
                        country: 'us',
                        confirmed: true,
                        domain: provider,
                        oauth_id: profile.id
                    }
    
                    try {
                        const userCreated: IUser = await AuthService._userRepository.Create(newUser);

                        if ( userCreated ) {
                            // Send email
                            const message = `Hello, ${newUser.name}.\n\nYour account has been created using ${provider}.\nHere you got your temporal credentials for legacy log in:\n` +
                            `Username: ${newUser.username}\n`+
                            `Password: ${SHA256(profile.id).toString().substring(0, 10)}\n`+
                            `You can also log in with your ${provider} account.\n\nThank you for using ${APP_NAME}.\nSincerely,\n${APP_NAME}'s Team`;

                            AuthService._mailHelper.sendMail([userCreated.email], APP_NAME.toLowerCase(), `Welcome to ${APP_NAME}!`, message, APP_NAME )
                            .then(success => success)
                            .catch(e => e);


                            const token: IToken = {
                                kind: provider,
                                access_token: accessToken,
                                fk_user: userCreated.id || 0
                            };

                            AuthService._tokenRepository.Create(token).then(token => done(null, userCreated) ).catch(e => new Error(e));
                            
                        } else done(new Error(`User ${FAILED_CREATE}`), null);

                    } catch (error) {
                        throw error;
                    }
                }
            }
            
        } catch (error) {
            console.log(error.stack);
            return done(error);
        }
    }
}