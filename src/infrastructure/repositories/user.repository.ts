/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Handles all database transactions related to User
 */

import { User, IUser } from "../../domain/models/user.model";
import IUserRepository from "../../core/repositories/user.repository";
import { injectable } from 'inversify';

@injectable()
export class UserRepository implements IUserRepository {

    constructor() {
    }

    /**
     * @description Create a new user
     * @param model User to create
     */
    Create(model: IUser): Promise<IUser> {
        User.startModel();
        return User.create(model)
        .then(user => user)
        .catch(e => e);
    }    

    /**
     * @description Update a user
     * @param Id User-to-modify's ID
     * @param payload Data to insert
     */
    Update(Id: number, payload: any): Promise<void> {
        User.startModel();
        return User.update(payload, {where: { id: Id }})
        .then(user => user)
        .catch(e => e);
    }

    /**
     * @description Delete a user
     * @param Id User-to-delete's ID
     */
    Delete(Id: number): Promise<number> {
        User.startModel();
        return User.destroy({where:{ id: Id }})
        .then(user => user)
        .catch(e => e);
    }

    /**
     * @description Get a user by it's ID
     * @param Id User-to-find's ID
     */
    GetById(Id: number): Promise<IUser> {
        User.startModel();
        return User.findByPk(Id, {raw: true})
        .then(user => user)
        .catch(e => e);
    }
    
    /**
     * @description Get all users
     * @param limit Max items
     * @param page Page number
     */
    GetAll(limit: number, page: number): Promise<{rows: IUser[], count: number}> {
        User.startModel();
        return User.findAndCountAll({raw: true, limit: limit, offset: page, order: [ ['id', 'ASC'] ]})
        .then(users => users)
        .catch(e => e);
    }

    /**
     * @description Find a single user with custom queries
     * @param args Query object
     */
    FindOne(args?: any): Promise<User> {
        User.startModel();
        return User.findOne({raw: true, where: args })
        .then(user => user)
        .catch(e => e);
    }

    /**
     * @description Find users with custom queries
     * @param limit Max items
     * @param page Page number
     * @param args Query object
     */
    FindMany(limit: number, page: number, args?: any): Promise<User[]> {
        User.startModel();
        return User.findAll({raw: true, where: args, limit: limit, offset: page, order: [ ['id', 'ASC'] ] })
        .then(user => user)
        .catch(e => e);
    }
}