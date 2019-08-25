/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Sets user operations
 */

import { IUser } from "../../domain/models/user.model";
import IService from "../service";

export default interface IUserService extends IService<IUser> {
    changePassword(Id: any, payload: any): Promise<IUser>;
}