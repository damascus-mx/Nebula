import { UserController } from '../controllers/user.controller'; 
import express from 'express';
import { UserRepository } from '../infrastructure/repositories/user.repository';

const _userRepo = new UserRepository();

const api = express.Router();
const controller = new UserController(_userRepo);

api.post('/user', controller.CreateUser);
api.get('/user', controller.GetUsers);
api.get('/user/:id', controller.GetUser);

export const UserRoutes = api;