/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports Database connection instance using Singleton
 */

import { Sequelize } from 'sequelize';

export abstract class PoolInstance {
    private static _Pool: Sequelize;

    constructor(){}

    /**
     * @description Returns a database connection / pool instance
     */
    public static getInstance(): Sequelize {
        if ( !PoolInstance._Pool ) {
            PoolInstance._Pool = new Sequelize(process.env.LOCAL_DB || '', { logging: false })
        }
        return PoolInstance._Pool;
    }
}