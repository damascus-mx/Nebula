import { IUser } from "../../domain/models/user.model";
import IService from "../service";

export default interface IUserService extends IService<IUser> {
    changePassword(Id: any, payload: any): Promise<IUser>;
}