import { GENERIC_ERROR } from "../common/config/app.config";
import IUserController from "../core/controllers/user.controller";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import IUserRepository from "../core/repositories/user.repository";

export class UserController implements IUserController {
    private static _userRepository: IUserRepository;

    constructor() {
        UserController._userRepository = new UserRepository();
    }

    async Create(req: any, res: any) {
        const payload = req.body;
        
        res.status(500).send({message: 'Method under construction.'});
    }

    async Update(req: any, res: any) {
        throw new Error("Method not implemented.");
    }

    async Delete(req: any, res: any) {
        throw new Error("Method not implemented.");
    }

    async GetAll(req: any, res: any) {
        try {
            const users = await UserController._userRepository.GetAll();
            users && users.length > 0 ? res.status(200).send({users: users}) : res.status(404).send({message: 'User not found'});
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async GetById(req: any, res: any) {
        try {
            const users = await UserController._userRepository.GetById(req.params.id);
            users ? res.status(200).send({users: users}) : res.status(404).send({message: 'User not found'});
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    async LogIn(req: any, res: any) {
        throw new Error("Method not implemented.");
    }
    
    async ChangePassword(req: any, res: any) {
        throw new Error("Method not implemented.");
    }
}