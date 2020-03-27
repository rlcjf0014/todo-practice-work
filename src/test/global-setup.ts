const {setup: setupDevServer} = require('jest-dev-server');


module.exports = async function globalSetup {
    await setupDevServer({
        command: 'node --require ts-node/register index.ts',
        launchTimeout: 5000,
        port: 3000,
    })
}