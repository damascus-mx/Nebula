import { Sequelize } from 'sequelize';

export abstract class PoolInstance {
    private static _Pool: Sequelize;

    constructor(){}

    public static getInstance(): Sequelize {
        if ( !PoolInstance._Pool ) {
            PoolInstance._Pool = new Sequelize(process.env.LOCAL_DB || '', { logging: false })
        }
        return PoolInstance._Pool;
    }
}