/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports a generic repository with default actions
 */

export interface IRepository<T> {
    Create(model: T): Promise<void>;
    Update(Id: any, payload: any): Promise<void>;
    Delete(Id: any): Promise<void>;
    GetById(Id: any): Promise<T>;
    GetAll(): Promise<T[]>;
    FindOne(args?: any): Promise<T>;
    FindMany(args?:any): Promise<T[]>;
}