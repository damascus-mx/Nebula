// Modules
import "reflect-metadata";
import cluster  from 'cluster';
import { Pool } from 'pg';
import dotenv from 'dotenv';
// Custom Modules
import app from './app';
import { PoolInstance } from '../infrastructure/pool';

// Start dotenv
dotenv.config();

// Start pool
const pool: Pool = PoolInstance.getInstance();

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
    // pool.query('SELECT NOW()').then(res => console.log(res.rows[0])).catch(e => console.log(e.message));
    app.listen( PORT, () => { console.log(`Server running on port ${PORT}`); });
}