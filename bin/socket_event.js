var _ = require('lodash');

let users = [];
socketConnection = (io) => {
    io.on('connection', (socket) => {
        const ipconnected = socket.request.connection.remoteAddress;
        console.log('Socket connection on ' + socket.handshake.headers.host);
        // console.log(socket.rooms);

        // inisialisasi room
        socket.on('JoinSocket', (data) => {
            // console.log(data)
            // console.log(users);
            // if (users.some(user => user.username === data.username)) {
            // console.log("Object found inside the array.");
            // } else {
            data['id'] = socket.id;
            users.push(data);
            // users.push({ id: socket.id });
            socket.join(data.roomid);
            console.log(users);
            // console.log("Object not found.");
            // }
            // console.log(io.sockets.sockets)
            console.log("user " + data.username + " has joined");
            updateUserActive(data, users, 'login');
        });

        // send socket list user active
        const updateUserActive = (data, user, type = '') => {
            let roomid = data.roomid;
            let newUser = '';
            if (type == 'logout') {
                newUser = user;
                let idsocket = socket.id;
                io.sockets.sockets.forEach((socket) => {
                    // If given socket id is exist in list of all sockets, kill it
                    if (socket.id === idsocket)
                        socket.disconnect(true);
                });
            } else {
                newUser = user.filter((u) => {
                    return u.roomid == roomid;
                });

                // console.log(io.sockets.sockets[socket.id])
            }
            io.to(roomid).emit('newActiveUser', data);
            io.to(roomid).emit("updateUserActive", newUser);
        }


        socket.on('logout', (data) => {
            // console.log(socket.id);
            let newUser = _.remove(users, (u) => {
                return u.roomid == data.roomid && u.username == data.username;
            });
            updateUserActive(data, newUser, 'logout');
        });

        // send chat & get data
        socket.on('chat', (data) => {
            console.log(data)
            console.log(io.sockets.sockets);
            // send respon with roomid
            io.to(data.roomId).emit('message', data);
            // io.sockets.emit('chat', data);
        });

    });
}

module.exports = { socketConnection };