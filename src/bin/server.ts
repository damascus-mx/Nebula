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

// Custom Modules
import app from './app';
import { PoolInstance } from '../infrastructure/pool';
import { Sequelize } from 'sequelize';
import Config from '../common/config';

// Start pool
const sequelize: Sequelize = PoolInstance.getInstance();

const PORT = Config.EXPRESS_PORT;

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