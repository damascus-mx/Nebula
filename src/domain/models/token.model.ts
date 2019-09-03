/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports Token class / interface model
 */
import { Model, DataTypes } from 'sequelize';
import { PoolInstance } from '../../infrastructure/pool';
import { User } from './user.model';

export interface IToken {
    id?: number,
    kind: string,
    access_token: string,
    refresh_token?: string | null,
    fk_user: number,
    created_at?: Date,
    updated_at?: Date
}

export class Token extends Model implements IToken {
    id?: number;
    kind!: string;
    access_token!: string;
    refresh_token?: string | null;
    fk_user!: number;
    created_at!: Date;
    updated_at!: Date;

    public static startModel() {
        this.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            kind: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            access_token: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            refresh_token: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            fk_user: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: User,
                    key: 'fk_user'
                }
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date()
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date()
            }
        }, {
            schema: 'client',
            tableName: 'token',
            timestamps: false,
            sequelize: PoolInstance.getInstance()
        });
    }
}