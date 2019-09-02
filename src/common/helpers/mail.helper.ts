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
import Config from '../config';
import { DOMAIN } from '../config/app.config';
import { injectable } from 'inversify';
import { IMailHelper } from '../../core/helpers/mail.interface';

@injectable()
export default class MailHelper implements IMailHelper {
    private static _transporter: Mail;

    constructor() {
        AWS.config.update({
            accessKeyId: Config.aws.SES_ACCESS_KEY,
            secretAccessKey: Config.aws.SES_SECRET_KEY,
            region: Config.aws.SES_REGION
        })

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
