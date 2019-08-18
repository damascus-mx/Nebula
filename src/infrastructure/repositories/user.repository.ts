import { User } from "../../domain/models/user.model";
import IUserRepository from "../../core/repositories/user.repository";
import { Sequelize } from 'sequelize';
import { PoolInstance } from "../pool";

export class UserRepository implements IUserRepository {

    constructor() {
    }

    Create(model: User): any {
        // const rds = new AWS.RDS();
        // return this._Pool.query(`CALL CLIENT.CREATE_USER()`)
    }    

    Update(Id: number, payload: any): any {
        throw new Error("Method not implemented.");
    }

    Delete(Id: number): any {
        throw new Error("Method not implemented.");
    }

    GetById(Id: number): Promise<User> {
        User.startModel();
        return User.findOne({raw: true, where: { id: Id }})
        .then(user => user)
        .catch(e => e);
    }
    
    GetAll(): Promise<User[]> {
        User.startModel();
        return User.findAll({raw: true})
        .then(users => users)
        .catch(e => e);
    }
}