const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');


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

const app = express();
app.use('/pp', express.static(path.join(__dirname + '/public/uploads/profilepictures')));
// app.use(express.static("/public"));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
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



app.listen(3001, () => {
    console.log('api listening on port 3001')
});