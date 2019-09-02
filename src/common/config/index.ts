/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Stores all enviroment const
 */
import dotenv from 'dotenv';
dotenv.config();

export default {
    ENVIROMENT: process.env.NODE_ENV || 'development',
    ENCRYPT_KEY: process.env.ENCRYPT_KEY || 'null',
    EXPRESS_PORT: process.env.PORT || 5000,
    db: {
        CONNECTION_STRING: process.env.CONNECTION_STRING || 'null',
        LOCAL_DB: process.env.LOCAL_DB || 'null'
    },
    aws: {
        ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'null',
        SECRET_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'null',
        SES_REGION: process.env.AWS_SMTP_REGION || 'null',
        SES_ACCESS_KEY: process.env.AWS_SES_ACCESS_KEY || 'null',
        SES_SECRET_KEY: process.env.AWS_SES_SECRET_KEY || ' null',
        S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY || 'null',
        S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY || 'null',
        S3_CDN_REGION: process.env.AWS_S3_CDN_REGION || 'null',
        RDS_ACCESS_KEY: process.env.AWS_RDS_ACCESS_KEY || 'null',
        RDS_SECRET_KEY: process.env.AWS_RDS_SECRET_KEY || 'null'
    },
    facebook: {
        APP_ID: process.env.FACEBOOK_ID || 'null',
        APP_SECRET: process.env.FACEBOOK_SECRET || 'null'
    },
    google: {
        APP_ID: process.env.GOOGLE_ID || 'null',
        APP_SECRET: process.env.GOOGLE_SECRET || 'null'
    }
}