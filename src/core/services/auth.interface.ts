/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Handles all authentication-required interface
 */

import { Request } from "express";

export interface IAuthService {
    verifyPassword(password: string, cipher: string): Promise<boolean>;
    generateJWTToken(payload: string | object | Buffer): string;
    handleOAuth2(req: Request, accessToken: string, refreshToken: string, profile: any, done: any, provider: string): Promise<any>;
}