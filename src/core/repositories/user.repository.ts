import { UserModel } from "../../domain/models/user.model";
import { IRepository } from "../repository";

export default interface IUserRepository extends IRepository<UserModel> {
}