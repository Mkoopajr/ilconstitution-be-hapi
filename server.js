'use strict';

const Hapi = require('hapi');
const routes = require('./lib/routes');

const server = new Hapi.Server();
server.connection({host: '0.0.0.0', port: parseInt(process.env.PORT, 10) || 8900});

server.state('session', {
    ttl: 60000,
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
