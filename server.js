'use strict';

const Hapi = require('hapi');
const routes = require('./lib/routes');

// Better way to do this?
const urls = process.env.CORSURLS.split(' ');

const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: parseInt(process.env.PORT, 10) || 8900,
    routes: {
        cors: {
            origin: urls,
            credentials: true
        }
    }
});

server.state('session', {
    // Two Hours, should be more than enough time.
    ttl: 7200000,
    isSecure: true,
    isHttpOnly: true,
    encoding: 'base64json'
});

server.route(routes);

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Server start at: ${server.info.uri}`);
});
