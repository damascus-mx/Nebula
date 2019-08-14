import { UserController } from '../controllers/user.controller'; 
import express from 'express';

const api = express.Router();
const controller = new UserController();

api.post('/user', controller.CreateUser);

export const UserRoutes = api;