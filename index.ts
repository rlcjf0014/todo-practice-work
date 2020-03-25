import {start} from './src/server';

start()
    .catch((err) => {
        console.error(`Error starting server: ${err.message}`);
        process.exit(-1)
    }) 