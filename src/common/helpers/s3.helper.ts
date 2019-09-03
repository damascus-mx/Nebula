/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description AWS S3 File uploader
 */

// Interfaces
import { IS3Helper } from "../../core/helpers/s3.interface";
import { IStorageHelper } from "../../core/helpers/storage.helper";

// Misc
import { injectable, inject } from "inversify";
import { TYPES } from '../config/types';
import { Request } from "express";
import Config from '../config';

// Formidable - File uploading
import path from 'path';
import formidable, { File } from 'formidable';
import rootpath from 'app-root-path';
import uuid from 'uuid/v4';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import { FILE_INVALID_EXTENSION, DOMAIN, CODE_NAME } from "../config/app.config";
import { PromiseResult } from "aws-sdk/lib/request";

@injectable()
export default class S3Helper implements IS3Helper {
    private static S3: AWS.S3;
    private static _storageHelper: IStorageHelper;

    constructor(@inject(TYPES.StorageHelper) storageHelper: IStorageHelper) {
        S3Helper._storageHelper = storageHelper;
        S3Helper.S3 = new AWS.S3({accessKeyId: Config.aws.S3_ACCESS_KEY, secretAccessKey: Config.aws.S3_SECRET_KEY, region: Config.aws.S3_CDN_REGION });
    }

    async uploadImage(form: formidable.IncomingForm, req: Request, maxSize: number, contentLocationType: string, size?: number ): Promise<string> {
        try {
            form.encoding = 'utf-8';

            // File size
            const mbToBytes: number = 1024 * 1024;
            const maxFileSize: number = maxSize * mbToBytes;
            form.maxFieldsSize = maxFileSize;

            // Init folder
            const uploadDir = `${rootpath.path}/uploads/${contentLocationType}`;
            const createdFolder = await S3Helper._storageHelper.createDirectory(`${rootpath.path}/uploads`)
            .then(result => S3Helper._storageHelper.createDirectory(`${rootpath.path}/uploads/${contentLocationType}`)).catch(e => null);
    
            form.parse(req);
            const extensions: Array<string> = ['.jpg', '.png', '.jpeg'];
            
            const localFile: File = await new Promise( (resolve: any, reject: any) => {

                try {
                    form.on('fileBegin', (name, file: File) => {
                        const extension = path.extname(file.name).toLowerCase();
                        if (extensions.indexOf(extension) == -1) return form.emit('error', (FILE_INVALID_EXTENSION));
                        
                        file.path = `${uploadDir}/${file.name}`;
                    });
    
                    form.on('file', (name, file: File) => {
                        resolve(file);
                    });

                    form.on('error', (message: string) => {
                        reject(new Error(message));
                    });
                } catch (error) {
                    reject(error);
                }
            });


            const newFileName = `${uuid()}${path.extname(localFile.name)}`;
            const sharpedImage = size ? await sharp(`${uploadDir}/${localFile.name}`).resize(size, size).toBuffer() : await sharp(`${uploadDir}/${localFile.name}`).toBuffer();
            
            const deleteFile = await S3Helper._storageHelper.deleteFile(`${uploadDir}/${localFile.name}`);

            const bucket = `cdn.${DOMAIN}/${CODE_NAME}/${contentLocationType}`;

            const upload = await S3Helper.S3.upload({
                Bucket: bucket,
                Key: newFileName,
                Body: sharpedImage,
                ContentType: localFile.type
            });

            const data: AWS.S3.ManagedUpload.SendData = await upload.promise().then(data => data).catch(e => e);

            return `https://${data.Bucket}/${data.Key}`;
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(key: string, contentLocationType: string): Promise<PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError>> {
        try {
            const bucket = `cdn.${DOMAIN}/${CODE_NAME}/${contentLocationType}`;
            const deleteObject = await S3Helper.S3.deleteObject({
                Bucket: bucket,
                Key: key
            });
            const data: PromiseResult<AWS.S3.DeleteObjectOutput, AWS.AWSError> = await deleteObject.promise().then(data => data).catch(e => e);

            return data;
        } catch (error) {
            throw error;
        }
    }
}