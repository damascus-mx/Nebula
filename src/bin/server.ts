// Modules
import "reflect-metadata";
import cluster  from 'cluster';
import dotenv from 'dotenv';
// Custom Modules
import app from './app';
import { PoolInstance } from '../infrastructure/pool';
import { Sequelize } from 'sequelize';

// Start dotenv
dotenv.config();

// Start pool
// const pool: Pool = PoolInstance.getInstance();
const sequelize: Sequelize = PoolInstance.getInstance();

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