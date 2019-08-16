import { Repository } from "../../core/repository";
import { UserModel, toModel } from "../../domain/models/user.model";
import * as AWS from 'aws-sdk';
import { Pool } from 'pg';
import { PoolInstance } from "../pool";

export class UserRepository implements Repository<UserModel> {
    private _Pool: Pool;

    constructor() {
        this._Pool = PoolInstance.getInstance();
    }

    Create(model: UserModel): any {
        // const rds = new AWS.RDS();
        return this._Pool.query(`CALL CLIENT.CREATE_USER()`)
    }    

    Update(Id: number, payload: any): any {
        throw new Error("Method not implemented.");
    }

    Delete(Id: number): any {
        throw new Error("Method not implemented.");
    }

    GetById(Id: number): Promise<UserModel> {
        return this._Pool.query(`SELECT * FROM CLIENT.GET_USER(${Id})`)
                        .then(user => toModel(user.rows[0]))
                        .catch(e => { throw e });
    }
    
    GetAll(): Promise<UserModel[]> {
        return this._Pool.query('SELECT * FROM CLIENT.USER_BY_FOLLOWERS()')
                        .then(usersDB => {
                            usersDB.rows.forEach((item, i) => {
                                usersDB.rows[i] = toModel(item);
                            });
                            return usersDB.rows; 
                        })
                        .catch( e => { throw e });

    }
}