import { User, IUser } from "../../domain/models/user.model";
import IUserRepository from "../../core/repositories/user.repository";

export class UserRepository implements IUserRepository {

    constructor() {
    }

    Create(model: IUser): Promise<void> {
        User.startModel();
        return User.create(model)
        .then(user => user)
        .catch(e => e);
    }    

    Update(Id: number, payload: any): any {
        throw new Error("Method not implemented.");
    }

    Delete(Id: number): any {
        User.startModel();
        return User.destroy({where:{ id: Id }})
        .then(user => user)
        .catch(e => e);
    }

    GetById(Id: number): Promise<User> {
        User.startModel();
        return User.findByPk(Id, {raw: true})
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