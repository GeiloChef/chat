const chatRoomHandler = require('./chatroomHandler');
const messageHandler = require('./messageHandler');
const userHandler = require('../user/userHandler');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns all current active chatrooms for a user 
 */
async function getChatroomsForUser(req, res){
    const { uuid } = req.body;
    let chatrooms = await chatRoomHandler.getChatrooms(uuid);
    console.log(chatrooms);
    if(chatrooms){
        for(let chatroom of chatrooms){
            if(chatroom.roomtype === 0){
                for(let user of chatroom.alloweduser){
                    if(user !== uuid){
                        console.log(user);
                        let userinfo = await userHandler.getUserFromUUID(user);
                        chatroom.roomname = userinfo.username;
                        chatroom.image = userinfo.image;
                        break;
                    }
                }
            }
        }
        res.send({
            "status": "success",
            "roomsActive": chatrooms,  
        }).end();
    }else{
        res.send({
            status: "success",
            roomsActive: [],
        })
    }
}

/**
 * stores a message to the DB
 * @param {*} req includes the message data to be stored
 * @param {*} res 
 */
async function storeMessage(req, res){
    const { data } = req.body;
    // console.log(data);
    messageHandler.insertMessageToDb(data);
    res.send({status: "success"}).end();
}

async function setMessageAsSeen(req, res){
    const { uuid_message } = req.body;
    messageHandler.setMessageAsSeen(uuid_message.message);
    res.send({status: "success"}).end();
}

/**
 * gets the current chat history for a given chatroom
 * @param {*} req includes the uuid of the chatroom
 * @param {*} res 
 */
async function getChatHistory(req, res){
    const { room } = req.body;
    console.log(`Room: ${room}`)
    let chatHistory = await messageHandler.getChatHistory(room);
    // console.log(chatHistory);
    res.send({
        "status": "success",
        "chatHistory": chatHistory,  
    }).end();
}


/**
 * gets alls information of a given room
 * @param {*} req includes the room uuid
 * @param {*} res 
 */
async function getChatroomInfo(req, res){
    let data;
    const { room } = req.body;
    let chatroomInfo = await chatRoomHandler.getChatroomInfo(room);
    if(chatroomInfo){
        data = {
            status: "success",
            chatroomInfo: chatroomInfo
        }
    }else{
        data = {
            status: "error",
            message: "Chatroom Info could not be retrieved. Reload the page."
        }
    }
    res.send(data).end();
}

/**
 * creates a chat request between two users
 * TODO: send push notification for a new request
 * @param {*} req inludes uuid_from & uuid_to
 * @param {*} res 
 */
async function sendChatRequest(req, res){
    const { uuid_from, uuid_to } = req.body;

    let checkForValidUUID = await chatRoomHandler.checkForValidUUID(uuid_to);
    console.log(`is uuid_to valid: ${checkForValidUUID}`);
    if(!checkForValidUUID){
        res.send({
            status: "error",
            message: "The UUID you entered does not exist!"
        }).end();
        return;
    }

    // check if similar request is already in pipeline
    let checkForSimilarRequest = await chatRoomHandler.checkForSimilarRequest(uuid_from, uuid_to);
    console.log(`Similar request exists: ${checkForSimilarRequest}`)
    if(checkForSimilarRequest){
        res.send({
            status: "error",
            message: "You've already send a request to this user."
        }).end();
        return;
    }

    let checkforExistingChat = await chatRoomHandler.checkforExistingChat(uuid_from, uuid_to);
    console.log(`Chat exists: ${checkforExistingChat}`)
    if(checkforExistingChat){
        res.send({
            status: "error",
            message: "Chat Request could not be send. Try again later."
        }).end();
        return;
    }

    let createChatRequest = await chatRoomHandler.insertChatRequestToDb(uuid_from, uuid_to);
    console.log(`create chat: ${createChatRequest}`)
    if(createChatRequest){
        res.send({
            status: "success",
            message: 'Chat request was successfully sent.',
        }).end();
    }else{
        res.send({
            status: "error",
            message: "Chat Request could not be send. Try again later."
        }).end();
    }
}

/**
 * gets all current chatrequests for a user
 * @param {*} req includes uuid of user
 * @param {*} res 
 */
async function getRequestsForUser(req, res){
    const { uuid } = req.body;
    let requests = await chatRoomHandler.getRequests(uuid);
    console.log(requests);
    res.send({
        "status": "success",
        "requests": requests,  
    }).end();
}

/**
 * Handels a chatrequest - either accepts or declines it
 * After that the remaining chatrequests will be send back to the user
 * TODO: Inform the other user
 * @param {*} req 
 * @param {*} res 
 */
async function handleRequest(req, res){
    const { data } = req.body;
    console.log(data);
    let handleRequest = await chatRoomHandler.handleRequest(data);
    let requests = await chatRoomHandler.getRequests(data.request.uuid_to);
    let chats = await chatRoomHandler.getChatrooms(data.request.uuid_to);
    let sendData = {
        status: handleRequest.status,
        message: handleRequest.message,
        requests : requests,
        chats: chats
    }

    res.send(sendData).end();
}

/**
 * Gets a username from the UUID
 * @param {*} req 
 * @param {*} res 
 */
async function getUsernameFromUUID(req, res){
    const { uuid } = req.body;
    let user = await userHandler.getUserFromUUID(uuid);
    if(user){
        res.send({
            status: "success",
            username: user.username
        }).end();
    }else{
        res.send({
            status: "error",
            message: "There was no user found with this UUID",
        }).end();
    }
}

/**
 * Gets all need information for a chatrooms header.
 * @param {*} req inlcudes room uuid and user uuid
 * @param {*} res 
 */
async function getChatroomHeaderInfo(req, res){
    let sendData;
    let userinfo;
    const { data } = req.body;
    const chatroom = await chatRoomHandler.getChatroomInfo(data.room);
    // If its not a groupchat, we will get the users profile picture - currently there are no groupchats
    if(chatroom.roomtype === 0){
        for(let user of chatroom.alloweduser){
            if(user !== data.user_uuid){
                userinfo = await userHandler.getUserFromUUID(user);
                break;
            }
        }
        sendData = {
            status: "success",
            room_name: userinfo.username,
            room_image: userinfo.image,
        }
    }
    res.send(sendData).end();
}



module.exports = {
    getChatroomsForUser,
    storeMessage,
    getChatHistory,
    sendChatRequest,
    getRequestsForUser,
    handleRequest,
    getChatroomInfo,
    getUsernameFromUUID,
    getChatroomHeaderInfo,
    setMessageAsSeen,
}