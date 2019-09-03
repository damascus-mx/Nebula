/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description AWS S3 helper actions
 */

import formidable from "formidable";
import { Request } from "express";

export interface IS3Helper {
    uploadImage(form: formidable.IncomingForm, req: Request, maxSize: number, contentLocationType: string, size?: number): Promise<string>;
    deleteFile(key: string, contentLocationType: string): Promise<any>;
}