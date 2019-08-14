import { Repository } from "../core/repository";
import { UserModel } from "../domain/models/user.model";

export class UserController implements Repository<UserModel> {

    public Create(model: UserModel): void {
        throw new Error("Method not implemented.");
    }
    
    public Update(Id: any, payload: any): void {
        throw new Error("Method not implemented.");
    }
    
    public Delete(Id: any): void {
        throw new Error("Method not implemented.");
    }
    public GetById(Id: any): UserModel {
        throw new Error("Method not implemented.");
    }
    
    public GetAll(): UserModel[] {
        throw new Error("Method not implemented.");
    }

    public CreateUser(req: any, res: any) {
        res.status(200).send({message: 'Creating user...'});
    }


}