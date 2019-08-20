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

export abstract class AuthService {

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
}