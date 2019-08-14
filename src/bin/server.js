import cluster  from 'cluster';

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
    console.log('Connecting to DB.');
}