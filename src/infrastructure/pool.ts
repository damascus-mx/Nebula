import { Pool } from 'pg';

export abstract class PoolInstance {
    private static _Pool: Pool;

    constructor(){}

    public static getInstance(): Pool {
        if ( !PoolInstance._Pool ) {
            PoolInstance._Pool = new Pool({
                connectionString: process.env.LOCAL_DB
            });
        }
        return PoolInstance._Pool;
    }

    public query(text: string, params?: any): any {
        return PoolInstance._Pool.query(text, params);
    };
}