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
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { ITokenRepository } from '../core/repositories/token.repository';
import { TokenRepository } from '../infrastructure/repositories/token.repository';
import { IToken } from '../domain/models/token.model';
import { IUser } from '../domain/models/user.model';
import { SHA256 } from 'crypto-js';

export abstract class AuthService {
    private static _userRepository: IUserRepository;
    private static _tokenRepository: ITokenRepository;

    /**
     * @description Verifies password using bcrypt algorithm
     * @param password Plain password to compare
     * @param cipher Hashed password
     * @returns Boolean within Promise
     */
    public static async verifyPassword(password: string, cipher: string): Promise<boolean> {
        return bcrypt.compare(password, cipher)
        .then(result => result)
        .catch(e => false);
    }
    
    /**
     * @description Handles login / sign up OAuth2 operations
     * @param req Passed express request
     * @param accessToken Access token granted by provider
     * @param refreshToken Refresh token by provider
     * @param profile passport's profile and raw data
     * @param done passport's callback
     * @param provider provider type
     * @returns Promise
     */
    public static async handleOAuth2(req: Request, accessToken: string, refreshToken: string, profile: any, done: any, provider: string): Promise<any> {

        if (!this._userRepository) this._userRepository = new UserRepository();
        if (!this._tokenRepository) this._tokenRepository = new TokenRepository();

        try {
            const user = await this._userRepository.FindOne({oauth_id: profile.id});

            if (req.user) {
                if (user) {
                    if ( user.id === req.user.id ) {
                        try {
                            const lastToken = await this._tokenRepository.GetById(user.id);
        
                            const token: IToken = {
                                kind: provider,
                                access_token: accessToken,
                                fk_user: user.id || 0,
                                updated_at: new Date()
                            }
        
                            return lastToken ?  this._tokenRepository.Update(lastToken.id, token).then(token => done(null, user)).catch(e => done(e, null)) : 
                            this._tokenRepository.Create(token).then(token => done(null, user) ).catch(e => done(e, null));
        
                        } catch (error) {
                            throw new Error(error);
                        }
                    } else {
                        throw new Error(`${provider} account is already associated with another account`);
                    }
                }
                else {
                    let custom_image = null;
                    if (provider === 'facebook') custom_image = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    
                    const newUser: any = {
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        image: custom_image || profile.photos[0].value,
                        domain: provider,
                        oauth_id: profile.id,
                        updated_at: new Date()
                    }
    
                    try {
                        const response: any = await this._userRepository.Update(req.user.id, newUser);

                        if ( !response.errors ) {
                            const token: IToken = {
                                kind: provider,
                                access_token: accessToken,
                                fk_user: response.id || 0
                            };
                            this._tokenRepository.Create(token).then(token => done(null, response) ).catch(e => new Error(e));
                            
                        } else done(response.errors[0], null);

                    } catch (error) {
                        throw new Error(error);
                    }
                }
            } else {       
                if (user) {
    
                    try {
                        const lastToken = await this._tokenRepository.GetById(user.id);
    
                        const token: IToken = {
                            kind: provider,
                            access_token: accessToken,
                            fk_user: user.id || 0,
                            updated_at: new Date()
                        }
    
                        return lastToken ?  this._tokenRepository.Update(lastToken.id, token).then(token => done(null, user)).catch(e => done(e, null)) : 
                        this._tokenRepository.Create(token).then(token => done(null, user) ).catch(e => done(e, null));
    
                    } catch (error) {
                        throw new Error(error);
                    }
                }
                else {
                    let custom_image = null;
                    if (provider === 'facebook') custom_image = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    
                    const newUser: IUser = {
                        username: SHA256(profile.id).toString().substring(0, 25),
                        password: await bcrypt.hash(SHA256(profile.id).toString().substring(0, 20), 10),
                        email: profile.emails[0].value,
                        name: profile.name.givenName,
                        surname: profile.name.familyName,
                        image: custom_image || profile.photos[0].value,
                        country: 'us',
                        domain: provider,
                        oauth_id: profile.id
                    }
    
                    try {
                        const response: any = await this._userRepository.Create(newUser);

                        if ( !response.errors ) {
                            const token: IToken = {
                                kind: provider,
                                access_token: accessToken,
                                fk_user: response.id || 0
                            };
                            this._tokenRepository.Create(token).then(token => done(null, response) ).catch(e => new Error(e));
                            
                        } else done(response.errors[0], null);

                    } catch (error) {
                        throw new Error(error);
                    }
                }
            }
            
        } catch (error) {
            return done(error);
        }
    }
}