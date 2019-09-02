/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Handles all user operations
 */

import { NOT_FOUND, APP_NAME, EMAIL_SUPPORT, FILE_ERROR, FILE_INVALID_EXTENSION } from "../common/config/app.config";

// Interfaces
import IUserRepository from "../core/repositories/user.repository";
import { IUser } from "../domain/models/user.model";
import IUserService from "../core/services/user.interface";
import { IMailHelper } from "../core/helpers/mail.interface";
import { IAuthService } from "../core/services/auth.interface";
import { IStorageHelper } from "../core/helpers/storage.helper";

// Misc
import { injectable, inject } from "inversify";
import { TYPES } from "../common/config/types";
import { Request } from "express";
import enviroment from '../common/config';

// Formidable - File uploading
import path from 'path';
import formidable, { File } from 'formidable';
import rootpath from 'app-root-path';
import uuid from 'uuid/v4';
import sharp from 'sharp';
import AWS from 'aws-sdk';

// Auth
// - Cryptographic
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';

@injectable()
export default class UserService implements IUserService {
    private static _userRepository: IUserRepository;
    private static _mailHelper: IMailHelper;
    private static _authService: IAuthService;
    private static _storageHelper: IStorageHelper;

    constructor(
        @inject(TYPES.UserRepository) userRepository: IUserRepository,
        @inject(TYPES.MailHelper) mailHelper: IMailHelper,
        @inject(TYPES.AuthService) authService: IAuthService,
        @inject(TYPES.StorageHelper) storageHelper: IStorageHelper
    ) {
        UserService._userRepository = userRepository;
        UserService._mailHelper = mailHelper;
        UserService._authService = authService;
        UserService._storageHelper = storageHelper;
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

    async uploadProfilePicture(req: Request): Promise<any> {
        try {
            // Formidable
            const form = new formidable.IncomingForm();
            form.encoding = 'utf-8';

            // File size
            const mbToBytes: number = 1024 * 1024;
            const maxFileSize: number = 2 * mbToBytes;
            form.maxFieldsSize = maxFileSize;

            // Init folder
            const uploadDir = `${rootpath.path}/uploads/users`;
            const createdFolder = await UserService._storageHelper.createDirectory(`${rootpath.path}/uploads`)
            .then(result => UserService._storageHelper.createDirectory(`${rootpath.path}/uploads/users`)).catch(e => null);
    
            form.parse(req);
            const extensions: Array<string> = ['.jpg', '.png', '.jpeg'];
            
            const localFile: File = await new Promise( (resolve: any, reject: any) => {

                try {
                    form.on('fileBegin', (name, file: File) => {
                        const extension = path.extname(file.name).toLowerCase();
                        if (extensions.indexOf(extension) == -1) return form.emit('error', (FILE_INVALID_EXTENSION));
                        
                        file.path = `${uploadDir}/${file.name}`;
                    });
    
                    form.on('file', (name, file: File) => {
                        resolve(file);
                    });

                    form.on('error', (message: string) => {
                        reject(new Error(message));
                    });
                } catch (error) {
                    reject(error);
                }
            });


            const newFileName = `${uuid()}${path.extname(localFile.name)}`;
            const sharpedImage = await sharp(`${uploadDir}/${localFile.name}`).resize(250, 250).toBuffer(); // .toFile(`${uploadDir}/${newFileName}`);
            
            const deleteFile = await UserService._storageHelper.deleteFile(`${uploadDir}/${localFile.name}`);

            const S3 = new AWS.S3({accessKeyId: enviroment.aws.S3_ACCESS_KEY, secretAccessKey: enviroment.aws.S3_SECRET_KEY, region: enviroment.aws.S3_CDN_REGION });
            const upload = await S3.upload({
                Bucket: 'cdn.damascus-engineering.com/andromeda/users',
                Key: newFileName,
                Body: sharpedImage,
                ContentType: localFile.type
            });

            const data: AWS.S3.ManagedUpload.SendData = await upload.promise().then(data => data).catch(e => e);

            return data.Location;
            
        } catch (error) {
            throw error;
        }
    }
}