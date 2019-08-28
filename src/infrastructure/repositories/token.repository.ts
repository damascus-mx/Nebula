/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Handles all database transactions related to Token
 */

import { ITokenRepository } from "../../core/repositories/token.repository";
import { Token, IToken } from "../../domain/models/token.model";
import { injectable } from "inversify";

@injectable()
export class TokenRepository implements ITokenRepository {

    constructor() {}

    Create(model: IToken): Promise<IToken> {
        Token.startModel();
        return Token.create(model)
        .then(token => token).catch(e => e);
    }

    Update(Id: any, payload: any): Promise<void> {
        Token.startModel();
        return Token.update(payload, { where: { id: Id } })
        .then(token => token).catch(e => e);
    }

    Delete(Id: any): Promise<number> {
        Token.startModel();
        return Token.destroy({where: {id: Id}})
        .then(token => token).catch(e => e);
    }

    GetById(Id: any): Promise<IToken> {
        Token.startModel();
        return Token.findOne({ raw: true, where: { fk_user: Id } })
        .then(token => token).catch(e => e);
    }

    GetAll(limit: number, page: number): Promise<{rows: IToken[], count: number}> {
        Token.startModel();
        return Token.findAndCountAll({raw: true , limit: limit, offset: page })
        .then(tokens => tokens).catch(e => e);
    }

    FindOne(args?: any): Promise<IToken> {
        Token.startModel();
        return Token.findOne({ raw: true, where: args })
        .then(token => token).catch(e => e);
    }

    FindMany(limit: number, page: number, args?: any): Promise<IToken[]> {
        Token.startModel();

        return Token.findAll({ raw: true, where: args, limit: limit, offset: page })
        .then(tokens => tokens).catch(e => e);
    }
}