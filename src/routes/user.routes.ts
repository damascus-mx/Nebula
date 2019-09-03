/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports user-related endpoints
 */

import { Router } from 'express';
import IUserController from '../core/controllers/user.controller';
import isAuthenticated from '../middlewares/auth.middleware';
import isInRole from '../middlewares/role.middleware';
import { nebulaContainer } from '../common/config/inversify.config';
import { TYPES } from '../common/config/types';

const api = Router();
const controller: IUserController = nebulaContainer.get<IUserController>(TYPES.UserController);

api.route('/user')
.post(controller.Create)
.get(isAuthenticated, controller.GetAll);

api.route('/user/:id')
.put(isAuthenticated, controller.Update)
.delete(isAuthenticated, isInRole(['ROLE_ADMIN', 'ROLE_SUPPORT']), controller.Delete)
.get(isAuthenticated, controller.GetById);

// Auth
api.route('/account/user').post(controller.LogIn);
api.route('/account/user/:id').put(isAuthenticated, controller.ChangePassword);
api.route('/account/password/:id').put(controller.ForceChangePassword);

// User related
api.route('/testing/user').get(isAuthenticated, isInRole(['ROLE_USER']), controller.GetAll);
api.route('/account/io/profilepic').post(isAuthenticated, controller.UploadProfilePicture);

// - OAuth2
api.route('/connect/facebook').get(controller.Facebook);
api.route('/connect/facebook/callback').get(controller.FacebookCallback);
api.route('/connect/google').get(controller.Google);
api.route('/connect/google/callback').get(controller.GoogleCallback);

// Admin - Support
api.route('/support/account/user').post(isAuthenticated, isInRole(['ROLE_ADMIN', 'ROLE_SUPPORT']), controller.ForceSignIn);

export default api;