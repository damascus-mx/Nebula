/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Exports OAuth2 server instance using Singleton
 */

import oauth2orize from 'oauth2orize'

export abstract class OAuth2Server {
    private static _server: oauth2orize.OAuth2Server;

    private constructor() {}

    /**
     * @description Returns an OAuth2 server instance
     */
    public static getInstance(): oauth2orize.OAuth2Server { return !this._server ? oauth2orize.createServer() : this._server; }
}