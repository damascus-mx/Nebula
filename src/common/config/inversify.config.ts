/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Root DI Container
 */

import { Container } from 'inversify';
import { TYPES } from './types';

// Interfaces
import IUserService from '../../core/services/user.interface';
import IUserRepository from '../../core/repositories/user.repository';
import IUserController from '../../core/controllers/user.controller';
import { IMailHelper } from '../../core/helpers/mail.interface';
import { IAuthService } from '../../core/services/auth.interface';
import { ITokenRepository } from '../../core/repositories/token.repository';
import { IPassportConfig } from '../../core/config/passport.interface';
import { IStorageHelper } from '../../core/helpers/storage.helper';
import { IS3Helper } from '../../core/helpers/s3.interface';


// Implementations
import UserService from '../../services/user.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserController } from '../../controllers/user.controller';
import MailHelper from '../helpers/mail.helper';
import { AuthService } from '../../services/auth.service';
import { TokenRepository } from '../../infrastructure/repositories/token.repository';
import { PassportConfig } from './passport.config';
import StorageHelper from '../helpers/storage.helper';
import S3Helper from '../helpers/s3.helper';


const nebulaContainer = new Container();
nebulaContainer.bind<IUserController>(TYPES.UserController).to(UserController);
nebulaContainer.bind<IMailHelper>(TYPES.MailHelper).to(MailHelper).inSingletonScope();
nebulaContainer.bind<IPassportConfig>(TYPES.PassportConfig).to(PassportConfig).inSingletonScope();
nebulaContainer.bind<IAuthService>(TYPES.AuthService).to(AuthService);
nebulaContainer.bind<IUserService>(TYPES.UserService).to(UserService);
nebulaContainer.bind<ITokenRepository>(TYPES.TokenReposity).to(TokenRepository);
nebulaContainer.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
nebulaContainer.bind<IStorageHelper>(TYPES.StorageHelper).to(StorageHelper);
nebulaContainer.bind<IS3Helper>(TYPES.S3Helper).to(S3Helper).inSingletonScope();

export { nebulaContainer };