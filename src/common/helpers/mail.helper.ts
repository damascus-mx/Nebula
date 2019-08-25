/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Email operations
 */

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import AWS from 'aws-sdk';
import { DOMAIN } from '../config/app.config';

export default class MailHelper {
    private static _transporter: Mail;

    constructor() {
        AWS.config.accessKeyId = process.env.SMTP_USER;
        AWS.config.secretAccessKey = process.env.SMTP_PASSWORD;
        AWS.config.region = process.env.AWS_SMTP_REGION;

        MailHelper._transporter =  !MailHelper._transporter ? 
        nodemailer.createTransport({
            SES: new AWS.SES({ apiVersion: '2010-12-01' })
        }) : MailHelper._transporter; 
    }

    public sendMail(recipients: string[], sender: string, subject: string, message: string, senderName?: string): Promise<any> {
        try {
            /**
             * Mail_Domain = const domain name in app config
             * ex. @example.com
             */

            const senderFormated = senderName ? `${senderName} <${sender}@${DOMAIN}>` : `${sender}@${DOMAIN}`

            const mailOptions: Mail.Options = {
                to: recipients,
                from: senderFormated,
                subject: subject,
                text: message
            };
    
            return MailHelper._transporter.sendMail(mailOptions);
        } catch (error) {
            throw error;
        }
    }

    public sendMailHTML(recipients: string[], sender: string, subject: string, htmlTemplate: any, senderName?: string): Promise<any> {
        try {
            /**
             * Mail_Domain = const domain name in app config
             * ex. @example.com
             */

            const senderFormated = senderName ? `${senderName} <${sender}@${DOMAIN}>` : `${sender}@${DOMAIN}`

            const mailOptions: Mail.Options = {
                to: recipients,
                from: senderFormated,
                subject: subject,
                html: htmlTemplate
            };
    
            return MailHelper._transporter.sendMail(mailOptions);
        } catch (error) {
            throw error;
        }
    }

}
