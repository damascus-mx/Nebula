/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports user-related endpoints
 */

import express from 'express';
import IUserController from '../core/controllers/user.controller';
import { UserController } from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const api = express.Router();
const controller: IUserController = new UserController();

api.post('/user', controller.Create);
api.put('/user/:id', controller.Update);
api.delete('/user/:id', controller.Delete);
api.get('/user', controller.GetAll);
api.get('/user/:id', controller.GetById);

// Auth
api.post('/account/user', controller.LogIn);
api.put('/account/user/:id', controller.ChangePassword);
api.put('/account/password/:id', controller.ForceChangePassword);

// User related
api.get('/testing/user', isAuthenticated, controller.GetAll);
api.get('/connect/facebook', controller.Facebook);
api.get('/connect/facebook/callback', controller.FacebookCallback);
api.get('/connect/google', controller.Google);
api.get('/connect/google/callback', controller.GoogleCallback);

export const UserRoutes = api;