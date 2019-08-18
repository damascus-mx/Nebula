import { GENERIC_ERROR, MISSING_FIELDS } from "../common/config/app.config";
import IUserController from "../core/controllers/user.controller";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import IUserRepository from "../core/repositories/user.repository";
import { IUser } from "../domain/models/user.model";

export class UserController implements IUserController {
    private static _userRepository: IUserRepository;

    constructor() {
        UserController._userRepository = new UserRepository();
    }

    async Create(req: any, res: any) {
        try {
            const payload = req.body;

            if ( !payload.username || !payload.password || !payload.email || 
                !payload.name  || !payload.surname || !payload.country )
            return res.status(400).send({message: MISSING_FIELDS});

            const user: IUser = {
                username: payload.username.toLowerCase(),
                password: payload.password,
                email: payload.email.toLowerCase(),
                name: payload.name,
                surname: payload.surname,
                country: payload.country.toLowerCase()
            };

            UserController._userRepository.Create(user)
            .then((response: any) => {
                console.log(response);
                return !response.errors ? res.status(200).send({user: response.User.dataValues}) : res.status(400).send({message: response.errors[0].message});
            })
            .catch(e => e);
        } catch (error) {
            res.status(500).send({message: GENERIC_ERROR, error: error.message});
        }

    }

    async Update(req: any, res: any) {
        throw new Error("Method not implemented.");
    }

    async Delete(req: any, res: any) {
        try {
            if (req.params.id )
            UserController._userRepository.Delete(req.params.id)
            .then((response: any) => {
                console.log(response);
                return response > 0 ? res.status(200).send({message: 'User deleted'}) : res.status(400).send({message: 'User not found'});
            })
            .catch( e => e);
        } catch (error) {
            res.status(500).send({message: GENERIC_ERROR, error: error.message});
        }
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