import express from 'express';
import IUserController from '../core/controllers/user.controller';
import { UserController } from '../controllers/user.controller';

const api = express.Router();
const controller: IUserController = new UserController();

api.post('/user', controller.Create);
api.delete('/user/:id', controller.Delete);
api.get('/user', controller.GetAll);
api.get('/user/:id', controller.GetById);

export const UserRoutes = api;