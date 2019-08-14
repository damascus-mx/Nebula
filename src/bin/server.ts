// Modules
import cluster  from 'cluster';
import { Client } from 'pg';
import dotenv from 'dotenv';
// Custom Modules
import app from './app';

// Start dotenv
dotenv.config();

// Resources
const client = new Client({
    connectionString: process.env.CONNECTION_STRING
});
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
    client.connect();
    client.query('SELECT NOW()', (err, res) => {
        if (res) {
            app.listen( PORT, () => { console.log(`Server running on port ${PORT}`); });
        }
        client.end();
    });
}