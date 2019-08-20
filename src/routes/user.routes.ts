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

// User related
api.get('/testing/user', isAuthenticated, controller.GetAll);
api.get('/connect/facebook', controller.Facebook);
api.get('/connect/facebook/callback', controller.FacebookCallback);

export const UserRoutes = api;