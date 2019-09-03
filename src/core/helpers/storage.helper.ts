/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description IO Local Instance Storage operations interface
 */

export interface IStorageHelper {
    createDirectory(filePath: string): Promise<any>;
    renameFile(filePath: string, newFilePath: string): Promise<string>;
    deleteFile(filePath: string): Promise<any>;
}