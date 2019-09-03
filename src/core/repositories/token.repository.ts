/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Sets TokenRepository actions
 */
import { IRepository } from "../repository";
import { IToken } from "../../domain/models/token.model";

export interface ITokenRepository extends IRepository<IToken> {}