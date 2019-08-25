/**
 * @name Nebula
 * @version 0.0.1a
 * @copyright Damascus Engineering. 2019 All rights reserved.
 * @license Confidential This file belongs to Damascus Engineering intellectual property,
 * any unauthorized distribution of this file will be punished by law.
 * @author Alonso Ruiz
 * @description Initialize Express server - AWS RDS
 */

// Modules
import "reflect-metadata";
import cluster  from 'cluster';
import dotenv from 'dotenv';

// Custom Modules
import app from './app';
import { PoolInstance } from '../infrastructure/pool';
import { Sequelize } from 'sequelize';
import oauth2orize from 'oauth2orize';
import { OAuth2Server } from "../infrastructure/oauth.server";

// Start dotenv
dotenv.config();

// Start pool
const sequelize: Sequelize = PoolInstance.getInstance();

// Start OAuth2 server
const serverOAuth: oauth2orize.OAuth2Server = OAuth2Server.getInstance();

const PORT = process.env.PORT || 5000;

// Start API cluster
if ( cluster.isMaster ) {
    const CPU_COUNT = require('os').cpus().length;
    for (let i = 0; i < CPU_COUNT; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', function(worker) {
        console.log(`Cluster ${worker.id} died.`);
        cluster.fork();
    });
} else {
    sequelize.authenticate()
    .then(() => {
        app.listen( PORT, () => { console.log(`Server running on port ${PORT}`); });
    })
    .catch( e => {
        console.error(e.stack);
    });
}