/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Handles all user operations
 */

import { NOT_FOUND } from "../common/config/app.config";

// Interfaces
import IUserRepository from "../core/repositories/user.repository";
import { IUser } from "../domain/models/user.model";
import IUserService from "../core/services/user.interface";
// Repository
import { UserRepository } from "../infrastructure/repositories/user.repository";

// Auth
// - Cryptographic
import bcrypt from 'bcryptjs';
import { AuthService } from "../services/auth.service";
import MailHelper from "../common/helpers/mail.helper";


export default class UserService implements IUserService {
    private static _userRepository: IUserRepository;
    private static _mailHelper: MailHelper;

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
    
            this.initRepository();
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

            this.initRepository();
            return UserService._userRepository.Update(Id, payload);
        } catch (error) {
            throw error;
        }
    }

    async delete(Id: any): Promise<number> {
        try {
            this.initRepository();
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
            
            this.initRepository();
            const users = await UserService._userRepository.GetAll(maxItems, offset);
            return users.rows;
        } catch (error) {
            throw error;
        }
    }

    async getById(Id: any): Promise<IUser> {
        try {
            this.initRepository();
            return UserService._userRepository.GetById(Id);
        } catch (error) {
            throw error;
        }
    }

    async changePassword(Id: any, payload: any): Promise<IUser> {
        try {
            if ( payload.old === payload.new_password ) throw new Error('New password must be different');

            this.initRepository();
            const user = await UserService._userRepository.GetById(Id);
            if (!user) throw new Error(`User ${NOT_FOUND}`);

            if ( await AuthService.verifyPassword(payload.old_password, user.password) ) {
                const cipherText = await bcrypt.hash(payload.new_password, 10);
                UserService._userRepository.Update(user.id, {password: cipherText, updated_at: new Date()});

                UserService._mailHelper = new MailHelper();
                const message = `Hey, ${user.name}.\n\nYour password just changed at ${new Date().toString()}.\nPlease, feel free to contact us if it wasn't you.\n\n
                                Greetings,\nNightLifeX Team`;
                UserService._mailHelper.sendMail([user.email], 'nightlifex.support', 'Your password has changed', message, 'NightLifeX')
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
            this.initRepository();
            const user = await UserService._userRepository.GetById(Id);
            if (!user) throw new Error(`User ${NOT_FOUND}`);

            const cipherText = await bcrypt.hash(password, 10);
            UserService._userRepository.Update(Id, { password: cipherText, updated_at: new Date() });

            UserService._mailHelper = new MailHelper();
            const message = `Hey, ${user.name}.\n\nYour password just changed at ${new Date().toString()}.\nPlease, feel free to contact us if it wasn't you.\n\n
                            Greetings,\nNightLifeX Team`;
            UserService._mailHelper.sendMail([user.email], 'nightlifex.support', 'Your password has changed', message, 'NightLifeX')
            .then(success => success)
            .catch(error => console.log(`Error sending email to ${user.email}`));

            return user;

        } catch (error) {
            throw error;
        }
    }

    /**
    * Helpers
    */
   private initRepository(): void{
        UserService._userRepository = !UserService._userRepository ? new UserRepository() : UserService._userRepository;
   }
}