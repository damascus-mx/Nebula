/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description DI Dependencies
 */

const TYPES = {
    Repository: Symbol.for('Repository'),
    UserRepository: Symbol.for('UserRepository'),
    TokenReposity: Symbol.for('TokenRepository'),
    UserService: Symbol.for('UserService'),
    UserController: Symbol.for('UserController'),
    MailHelper: Symbol.for('MailHelper'),
    AuthService: Symbol.for('AuthService'),
    PassportConfig: Symbol.for('PassportConfig'),
    StorageHelper: Symbol.for('StorageHelper'),
    S3Helper: Symbol.for('S3Helper')
}

export { TYPES };