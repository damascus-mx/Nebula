import { Model, Sequelize, DataTypes } from 'sequelize';
import { PoolInstance } from '../../infrastructure/pool';
/*
export interface UserModel {
    id: number,
    username: string,
    password: string,
    email: string,
    name: string,
    surname: string,
    image?: string,
    cover?: string,
    bio?: string,
    total_followers: number,
    phone?: number,
    location?: string,
    city?: string,
    country: string,
    theme_hex?: string,
    iat: Date,
    role: string,
    private: boolean,
    verified: boolean,
    confirmed: boolean,
    active: boolean,
    last_modification: Date
}

export function toModel(objectModel: any): UserModel {
    return {
        id:  Number(objectModel.id),
        username: objectModel.username,
        password: objectModel.password,
        email: objectModel.email,
        name: objectModel.name,
        surname: objectModel.surname,
        image: objectModel.image,
        cover: objectModel.cover,
        bio: objectModel.bio,
        total_followers: Number(objectModel.total_followers),
        phone: Number(objectModel.phone),
        location: objectModel.location,
        city: objectModel.city,
        country: objectModel.country,
        theme_hex: objectModel.theme_hex,
        iat: new Date(objectModel.iat),
        role: objectModel.role,
        private: objectModel.private,
        verified: objectModel.verified,
        confirmed: objectModel.confirmed,
        active: objectModel.active,
        last_modification: new Date(objectModel.last_modification)
    };
}*/

export class User extends Model {
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
    public phone?: number | null;
    public location?: string | null;
    public city?: string | null;
    public country!: string;
    public theme_hex?: string | null;
    public iat!: Date;
    public role!: string;
    public private!: boolean
    public verified!: boolean;
    public confirmed!: boolean;
    public active!: boolean;
    public last_modification!: Date;


    public static startModel() {
        User.init({
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
                type: DataTypes.STRING(255),
                allowNull: true
            },
            cover: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            bio: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            total_followers: {
                type: DataTypes.BIGINT
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
                allowNull: false
            },
            private: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            verified: {
                type: DataTypes.BOOLEAN
            },
            confirmed: {
                type: DataTypes.BOOLEAN
            },
            active: {
                type: DataTypes.BOOLEAN
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