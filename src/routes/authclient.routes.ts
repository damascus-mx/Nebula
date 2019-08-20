import express from 'express';
import { AuthClient } from '../controllers/authclient.controller';
import { IAuthClientController } from '../core/controllers/authclient.controller';

const api = express.Router();
const controller: IAuthClientController = new AuthClient();

api.post('/auth/client', controller.Create);
api.get('/auth/client', controller.GetAll);

export const AuthClientRoutes = api;