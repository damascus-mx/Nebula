/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Email operations interface
 */

 export interface IMailHelper {
    sendMail(recipients: string[], sender: string, subject: string, message: string, senderName?: string): Promise<any>;
    sendMailHTML(recipients: string[], sender: string, subject: string, htmlTemplate: any, senderName?: string): Promise<any>;
}