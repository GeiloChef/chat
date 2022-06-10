const app = require('express')();
const http = require('http').createServer(app);
const jwt = require('jsonwebtoken');
const { join } = require('path');

const apiConnection = require('./src/apiConnection');

const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080'],
    }
})


app.get('/', (req, res) => {
    res.send('<h1>Hey</h1>');
});

io.on('connection', async (socket) => {
    console.log(`a user connected ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('my message', (msg) => {
        console.log('message: ' + msg);
    })

    socket.on('createRoom', function (data) {
        console.log(`user: ${data.user} joined room: ${data.room}`)
        socket.join(data.room);
        console.log(socket.rooms);
        // if (handlers.isUserAllowedInRoom(data.user, data.room)) {
        //     console.log("joining...")
        //     socket.join(data.room)
        // } else {
        //     console.log('not joining');
        //     console.log(socket.id);
        //     io.to(socket.id).emit('roomJoinError', `{'status': 'Error', 'message': 'User is not allowed in this Room. User will be redirected.'}`);
        // }
    });

    socket.on('leaveRoom', function (data) {
        console.log(data);
        console.log(`user: ${data.user} left room: ${data.room}`)
        socket.leave(data.room);
    })
});

io.on('connection', async (socket) => {
    socket.on('chat message', async (data) => {
        console.log(`Send message to: ${data.room}`)
        console.log(data);
        // Store the message in the Database so it wont get lost and can be retrieved at any time
        apiConnection.sendMessageToAPI(data);
        /**
         * Now we look if a reciever is in the chatroom rn. otherwise we will send him 
         * a seperate notification
         */
        for(user of data.chatroom.alloweduser){
            if(user !== data.sender_uuid){
                socket.to(user).emit('notify new message', data);
            }
        }
        socket.to(data.room).emit('broadcast', data);
    })

    socket.on('user is typing', (data) => {
        for(user of data.chatroom.alloweduser){
            if(user !== data.user){
                console.log(user);
                socket.to(user).emit('notify room typing', {room: data.chatroom.uuid, user: data.username});
            }
        }
        socket.to(data.chatroom.uuid).emit('another user is typing', {room: data.chatroom.uuid, user: data.username});
    })



    socket.on('message seen', (data) => {
        console.log(data); 
        apiConnection.setMessageAsSeen(data);
        for(user of data.chatroom.alloweduser){
            if(user !== data.user){
                console.log(user);
                socket.to(user).emit('message was seen', {room: data.chatroom.uuid, user: data.username});
            }
        }
        socket.to(data.chatroom.uuid).emit('update message history', {message_uuid: data.message})
    })
})

http.listen(3000, () => {
    console.log('listening on port 3000')
});


// io.use(function (socket, next) {
//     if (socket.handshake.query && socket.handshake.query.token) {
//         jwt.verify(socket.handshake.query.token, 'my_secret_key', function (err, decoded) {
//             if (err) {
//                 console.log("Error1")
//                 return next(new Error('Authentication error'));
//             }
//             socket.decoded = decoded;
//             next();
//         });
//     }
//     else {
//         console.log("Error2");
//         next(new Error('Authentication error'));
//     }
// })
