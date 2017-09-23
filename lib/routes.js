'use strict';

const uuid = require('uuid/v4');
const redis = require('redis');
const client = redis.createClient({
    host: process.env.DBHOST || '127.0.0.1',
    port: parseInt(process.env.DBPORT, 10) || 6379
});

client.on('error', (err) => {
    console.log(err);
});

module.exports = [
    {
        method: 'GET',
        path: '/start',
        handler: (req, res) => {
            let session = req.state.session;
            if (session) {
                return res.redirect('/question');
            }

            let id = uuid();
            client.multi()
                .sunionstore(id, 'q:keys')
                .expire(id, 60)
                .spop(id)
                .exec((err, data) => {
                    client.get(data[2], (err, doc) => {
                        return res(doc).state('session', id);
                    });
                });
        }
    },
    {
        method: 'GET',
        path: '/question',
        handler: (req, res) => {
            let session = req.state.session;
            if (!session) {
                return res.redirect('/start');
            }

            client.spop(session, (err, data) => {
                if (!data) {
                    return res('test end');
                } else {
                    client.get(data, (err, doc) => {
                        return res(doc);
                    });
                }
            });
        }
    },
];

