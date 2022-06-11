const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const { login, signup, verifyToken } = require("./src/auth/routeHandler");
const { changeUserSetting, getUserSettings, storeNewProfilePicture } = require("./src/user/routeHandler");
const {
    getChatroomsForUser,
    storeMessage,
    getChatHistory,
    sendChatRequest,
    getRequestsForUser,
    handleRequest,
    getChatroomInfo,
    getUsernameFromUUID,
    getChatroomHeaderInfo,
    setMessageAsSeen
} = require("./src/chat/routeHandler");

// const app = express();

if (fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use('/', express.static(path.join(__dirname, 'dist')));
}

app.use('/pp', express.static(path.join(__dirname + '/public/uploads/profilepictures')));
// app.use(express.static("/public"));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3001'],
}));

app.post("/login", login);

app.post("/signup", signup);

app.post("/verifyToken", verifyToken);

app.post("/getChatroomsForUser", getChatroomsForUser);

app.post("/getChatroomInfo", getChatroomInfo);

app.post("/getChatroomHeaderInfo", getChatroomHeaderInfo);

app.post("/getUsernameFromUUID", getUsernameFromUUID);

app.post("/getUserSettings", getUserSettings);

app.post("/changeUserSetting", changeUserSetting);

app.post("/storeNewProfilePicture", storeNewProfilePicture);

app.post("/storeMessage", storeMessage);

app.post("/setMessageAsSeen", setMessageAsSeen);

app.post("/getChatHistory", getChatHistory);

app.post("/sendChatRequest", sendChatRequest);

app.post("/getRequestsForUser", getRequestsForUser);

app.post("/handleRequest", handleRequest);

// app.listen(3001, () => {
//     console.log('api listening on port 3001')
// });



/**
 * Socket.io:
 */

const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080'],
    }
})

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
        storeMessage(data);
        /**
         * Now we look if a reciever is in the chatroom rn. otherwise we will send him 
         * a seperate notification
         */
        for (user of data.chatroom.alloweduser) {
            if (user !== data.sender_uuid) {
                socket.to(user).emit('notify new message', data);
            }
        }
        socket.to(data.room).emit('broadcast', data);
    })


    socket.on('user is typing', (data) => {
        for (user of data.chatroom.alloweduser) {
            if (user !== data.user) {
                console.log(user);
                socket.to(user).emit('notify room typing', { room: data.chatroom.uuid, user: data.username });
            }
        }
        socket.to(data.chatroom.uuid).emit('another user is typing', { room: data.chatroom.uuid, user: data.username });
    })




    socket.on('message seen', (data) => {
        console.log(data);
        setMessageAsSeen(data);
        for (user of data.chatroom.alloweduser) {
            if (user !== data.user) {
                console.log(user);
                socket.to(user).emit('message was seen', { room: data.chatroom.uuid, user: data.username });
            }
        }
        socket.to(data.chatroom.uuid).emit('update message history', { message_uuid: data.message })
    })
})

http.listen(3001, () => {
    console.log('listening on port 3001')
});