const express = require("express");
const bodyParser = require("body-parser");
const { normalizePort, Mongodb } = require('./bin/helpers');
const { socketConnection } = require('./bin/socket_event');
const http = require('http');
const { Server } = require('socket.io');
// settup express
const app = express();

/**
 * Mongodb setup createdb mongo 
 */
const db = Mongodb.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database connected'));

/**
 * Setup bodyparser parse application/x-www-form-urlencoded & parse application/json
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.send({ 'tes': 'ok' });
});

/**
 * created server
 */
const server = http.createServer(app);

/**
 * connnected to socketio
 */

// const io = require('socket.io')(server);
const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: '*',
    }
});
socketConnection(io);

/**
 * port instatiated
 */

let $port = normalizePort(process.env.PORT || 3000);
server.listen($port, () => {
    console.log('Server running in : ' + server.address().address + ':' + $port);
});