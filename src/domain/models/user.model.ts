/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports User class / interface model
 */

import { Model, DataTypes } from 'sequelize';
import { PoolInstance } from '../../infrastructure/pool';

export interface IUser {
    id?: number,
    username: string,
    password: string,
    email: string,
    name: string,
    surname: string,
    image?: string | null,
    cover?: string | null,
    bio?: string | null,
    total_followers?: number,
    phone?: number | 0,
    location?: string | null,
    city?: string | null,
    country: string,
    theme_hex?: string | null,
    role?: string,
    domain?: string | null,
    oauth_id?: string | null,
    private?: boolean,
    verified?: boolean,
    confirmed?: boolean,
    active?: boolean,
    created_at?: Date,
    updated_at?: Date
}

export class User extends Model implements IUser {
    public id!: number;
    public username!: string;
    public password!: string;
    public email!: string;
    public name!: string;
    public surname!: string;
    public image?: string | null;
    public cover?: string | null;
    public bio?: string | null;
    public total_followers!: number;
    public phone?: number | 0;
    public location?: string | null;
    public city?: string | null;
    public country!: string;
    public theme_hex?: string | null;
    public role!: string;
    public domain?: string | null;
    public oauth_id?: string | null;
    public private!: boolean
    public verified!: boolean;
    public confirmed!: boolean;
    public active!: boolean;
    public created_at!: Date;
    public updated_at!: Date;


    public static startModel() {
        this.init({
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            surname: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            image: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            cover: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            bio: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            total_followers: {
                type: DataTypes.BIGINT,
                defaultValue: 0
            },
            phone: {
                type: DataTypes.BIGINT,
                unique: true,
                allowNull: true
            },
            location: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            city: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            country: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            theme_hex: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            role: {
                type: DataTypes.STRING(50),
                defaultValue: 'ROLE_USER',
                allowNull: false
            },
            domain: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            oauth_id: {
                type: DataTypes.TEXT,
                allowNull: true,
                unique: true
            },
            private: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            confirmed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            active: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
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
            tableName: 'users',
            timestamps: false,
            sequelize: PoolInstance.getInstance()
        });
    }
}