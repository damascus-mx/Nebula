import { Repository } from "../core/repository";
import { UserModel } from "../domain/models/user.model";
import { UserRepository } from "../infrastructure/repositories/user.repository";
import { Pool } from "pg";
import { PoolInstance } from "../infrastructure/pool";
import { GENERIC_ERROR } from "../common/config/app.config";

export class UserController {
    private _Pool: Pool;

    constructor(private _userRepository: Repository<UserModel>) {
        this._Pool = PoolInstance.getInstance();
    }

    public async CreateUser(req: any, res: any) {
        const payload = req.body;
        

        res.status(500).send({message: 'Method under construction.'});
    }

    public async GetUser(req: any, res: any) {
        try {
            const repo = new UserRepository();
            const users = await repo.GetById(req.params.id);
            users ? res.status(200).send({users: users}) : res.status(404).send({message: 'User not found'});
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }

    public async GetUsers(req: any, res: any) {
        try {
            const repo = new UserRepository();
            const users = await repo.GetAll();
            users && users.length > 0 ? res.status(200).send({users: users}) : res.status(404).send({message: 'User not found'});
        } catch (error) {
            res.status(400).send({message: GENERIC_ERROR, error: error.message});
        }
    }


}