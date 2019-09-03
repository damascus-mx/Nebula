/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Handles all user operations
 */

import { NOT_FOUND, APP_NAME, EMAIL_SUPPORT, FILE_ERROR, FILE_INVALID_EXTENSION, FILE_DELETE_ERROR } from "../common/config/app.config";

// Interfaces
import IUserRepository from "../core/repositories/user.repository";
import { IUser } from "../domain/models/user.model";
import IUserService from "../core/services/user.interface";
import { IMailHelper } from "../core/helpers/mail.interface";
import { IAuthService } from "../core/services/auth.interface";
import { IS3Helper } from "../core/helpers/s3.interface";

// Misc
import { injectable, inject } from "inversify";
import { TYPES } from "../common/config/types";
import { Request } from "express";

// Formidable - File uploading
import formidable from 'formidable';

// Auth
// - Cryptographic
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';
import { ContentLocationEnum } from "../common/enums/contentlocation.enum";

@injectable()
export default class UserService implements IUserService {
    private static _userRepository: IUserRepository;
    private static _mailHelper: IMailHelper;
    private static _authService: IAuthService;
    private static _s3Helper: IS3Helper

    constructor(
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.MailHelper) mailHelper: IMailHelper,
        @inject(TYPES.AuthService) authService: IAuthService,
        @inject(TYPES.S3Helper) s3Helper: IS3Helper
    ) {
        UserService._userRepository = userRepository;
        UserService._mailHelper = mailHelper;
        UserService._authService = authService;
        UserService._s3Helper = s3Helper;
    }

    async create(payload: any): Promise<IUser> {
        try {
            const cipherText = await bcrypt.hash(payload.password, 10);

            const user: IUser = {
                username: payload.username.toLowerCase(),
                password: cipherText,
                email: payload.email.toLowerCase(),
                name: payload.name,
                surname: payload.surname,
                country: payload.country.toLowerCase()
            };
    
            return UserService._userRepository.Create(user);
        } catch (error) {
            throw error;
        }
    }

    async update(Id: any, payload: any): Promise<void> {
        try {
            payload.updated_at = new Date();

            if (payload.username)   payload.username = payload.username.toLowerCase();
            if (payload.email)  payload.email = payload.email.toLowerCase();

            return UserService._userRepository.Update(Id, payload);
        } catch (error) {
            throw error;
        }
    }

    async delete(Id: any): Promise<number> {
        try {
            return UserService._userRepository.Delete(Id);
        } catch (error) {
            throw error;
        }
    }

    async getAll(limit: number, page: number): Promise<IUser[]> {
        try {
            const currentPage = page && page > 0 ? page - 1 : 0;
            const maxItems = limit && limit > 0 ? limit : 20;
            const offset: number = Number(currentPage) * Number(maxItems);
            
            const users = await UserService._userRepository.GetAll(maxItems, offset);
            return users.rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(Id: any): Promise<IUser> {
        try {
            return UserService._userRepository.GetById(Id);
        } catch (error) {
            throw error;
        }
    }

    async changePassword(Id: any, payload: any): Promise<IUser> {
        try {
            if ( payload.old === payload.new_password ) throw new Error('New password must be different');

            const user = await UserService._userRepository.GetById(Id);
            if (!user) throw new Error(`User ${NOT_FOUND}`);

            if ( await UserService._authService.verifyPassword(payload.old_password, user.password) ) {
                const cipherText = await bcrypt.hash(payload.new_password, 10);
                UserService._userRepository.Update(user.id, {password: cipherText, updated_at: new Date()});

                const message = `Hey, ${user.name}.\n\nYour password just changed at ${new Date().toString()}.\nPlease, feel free to contact us if it wasn't you.\n\n`+
                                `Greetings,\n${APP_NAME}'s Team`;
                UserService._mailHelper.sendMail([user.email], EMAIL_SUPPORT, 'Your password has changed', message, APP_NAME)
                .then(success => success)
                .catch(error => console.log(`Error sending email to ${user.email}`));

                return user;
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    async forceChangePassword(Id: any, password: string): Promise<IUser> {
        try {
            const user = await UserService._userRepository.GetById(Id);
            if (!user) throw new Error(`User ${NOT_FOUND}`);

            const cipherText = await bcrypt.hash(password, 10);
            UserService._userRepository.Update(Id, { password: cipherText, updated_at: new Date() });

            const message = `Hey, ${user.name}.\n\nYour password just changed at ${new Date().toString()}.\nPlease, feel free to contact us if it wasn't you.\n\n`+
                            `Greetings,\n${APP_NAME}'s Team`;
            UserService._mailHelper.sendMail([user.email], EMAIL_SUPPORT, 'Your password has changed', message, APP_NAME)
            .then(success => success)
            .catch(error => console.log(`Error sending email to ${user.email}`));

            return user;

        } catch (error) {
            throw error;
        }
    }

    async forceSignIn(user: string): Promise<string> {
        try {
            const userToJWT = await UserService._userRepository.FindOne(Sequelize.or({ username: user.toLowerCase() }, { email: user.toLowerCase() }));
            return UserService._authService.generateJWTToken(userToJWT);
        } catch (error) {
            throw error;
        }
    }

    async uploadProfilePicture(req: Request): Promise<string> {
        try {
            // Formidable
            const form = new formidable.IncomingForm();

            const user = await UserService._userRepository.GetById(req.user.id);

            if ( user.image ) {
                const userImage = user.image.split('/');
                UserService._s3Helper.deleteFile(userImage[userImage.length - 1], ContentLocationEnum.USER).then(data => {
                    if (!data) {
                        throw new Error(FILE_DELETE_ERROR);
                    }
                }).catch(e => e);
            }


            const s3URL = await UserService._s3Helper.uploadImage(form, req, 2, ContentLocationEnum.USER, 250);
            const userUpdated = await UserService._userRepository.Update(req.user.id, { image: s3URL });

            return s3URL;
            
        } catch (error) {
            throw error;
        }
    }
}