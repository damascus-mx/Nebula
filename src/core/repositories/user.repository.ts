/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Sets UserRepository actions
 */

import { IUser } from "../../domain/models/user.model";
import { IRepository } from "../repository";

export default interface IUserRepository extends IRepository<IUser> {
}