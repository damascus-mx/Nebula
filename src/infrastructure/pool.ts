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
import Config from '../common/config';

export abstract class PoolInstance {
    private static _Pool: Sequelize;

    private constructor(){}

    /**
     * @description Returns a database connection / pool instance
     */
    public static getInstance(): Sequelize { return !this._Pool ? new Sequelize(Config.db.LOCAL_DB, { logging: false }) : this._Pool; }
}