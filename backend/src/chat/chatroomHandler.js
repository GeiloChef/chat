const mysql = require('mysql2/promise');
const { randomUUID } = require('crypto');

const handler = require('../handler');

/**
 * 
 * @param {UUID} uuid 
 * @returns an array of all chatrooms for a certain user
 */
async function getChatrooms(uuid) {
    let con = await handler.connection();
    const query = await con.execute('SELECT * FROM `chatrooms` WHERE `alloweduser` LIKE ?', [`%${uuid}%`]);
    con.end();
    if (query[0].length == 0) {
        return false
    } else {
        let chatrooms = query[0]
        for(let chatroom of chatrooms){
            // Get last Message of chatroom
            let con = await handler.connection();
            const lastMessage = await con.execute('SELECT `messages`.*, `user`.`username` FROM `messages` LEFT JOIN `user` ON `messages`.`sender_uuid` = `user`.`uuid` WHERE `room` = ? ORDER BY `time` DESC LIMIT 1',
            [chatroom.uuid]);
            con.end();
            chatroom.alloweduser = chatroom.alloweduser.split(";")
            chatroom.isTyping = false;
            chatroom.lastMessage = lastMessage[0][0];
        }
        return chatrooms;
    }
}

async function checkForSimilarRequest(uuid_from, uuid_to) {
    let con = await handler.connection();
    const query = await con.execute(
        'SELECT * FROM `requests` WHERE `uuid_from` = ? AND `uuid_to` = ?',
        [uuid_from, uuid_to]);
    con.end();
    if (query[0].length > 0) {
        // user exists
        return true;
    } else {
        return false;
    }
}

async function checkforExistingChat(uuid_from, uuid_to) {
    let con = await handler.connection();
    const query = await con.execute(
        'SELECT * FROM `chatrooms` WHERE `roomtype` = 0 AND `alloweduser` LIKE ? && `alloweduser` LIKE ?',
        [`%${uuid_from}%`, `%${uuid_to}%`]);
    con.end();
    if (query[0].length > 0) {
        // user exists
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * @param {String} uuid_from 
 * @param {String} uuid_to 
 * 
 * @returns the status if the request could be sent.
 */
async function insertChatRequestToDb(uuid_from, uuid_to) {
    let con = await handler.connection();
    let uuid = randomUUID();
    let insert = await con.query(
        'INSERT INTO `requests` (uuid, uuid_from, uuid_to) VALUES (?, ? , ?)',
        [uuid, uuid_from, uuid_to]);
    con.end();
    if(insert){
        return {
            status: "success",
            uuid: uuid,
        }
    }else{
        return {
            status: "error"
        }
    }

}

/**
 * 
 * @param {String} uuid 
 * @returns Array of all requests
 */
async function getRequests(uuid) {
    let con = await handler.connection();
    const query = await con.execute(
        'SELECT `requests`.*, `user`.`username` FROM `requests` LEFT JOIN `user` ON `requests`.`uuid_to` = `user`.`uuid` WHERE `uuid_to` = ? AND `status` != 1',
        [uuid]);
    con.end();
    if (query[0].length == 0) {
        return false
    } else {
        return query[0];
    }
}

/**
 * Checks if the entered uuid is existend
 * @param {String} uuid 
 * @returns boolean
 */
async function checkForValidUUID(uuid) {
    let con = await handler.connection();
    const query = await con.execute('SELECT * FROM `user` WHERE `uuid` = ?', [uuid]);
    con.end();
    if (query[0].length == 0) {
        return false
    } else {
        return query[0];
    }
}

/**
 * Handles the Request (accept or decline)
 * @param {Object} data 
 * @returns Object with info if the handling was done successfully
 */
async function handleRequest(data) {
    switch (data.action) {
        case "accept":
            return await acceptRequest(data.request);
            break;
        case "decline":
            return await declineRequest(data.request);
            break;
    }
}

/**
 * 
 * @param {Object} chatRequest 
 * @returns Object with Info, if Request was accepted successfully
 */
async function acceptRequest(chatRequest) {
    let con = await handler.connection();
    let alloweduser = `${chatRequest.uuid_from};${chatRequest.uuid_to}`;
    let createChatroom = await con.query(
        'INSERT INTO `chatrooms` (uuid, roomname, alloweduser) VALUES (?, ? , ?)',
        [chatRequest.uuid, "chatroom", alloweduser]);
    if (!createChatroom) {
        con.end();
        return {
            status: "error",
            message: "The chat request could not be handled. Try again later."
        }
    }

    let deleteRequest = await con.query('DELETE FROM `requests` WHERE `uuid` = ?', [chatRequest.uuid])
    con.end();
    if (!deleteRequest) {
        return {
            status: "error",
            message: "The chat request could not be handled. Try again later."
        }
    } else {
        return {
            status: "success",
            message: "You accepted the request. Start chatting now!"
        }
    }
}

/**
 * 
 * @param {Object} chatRequest 
 * @returns Object with Info, if request decine was successfull
 */
async function declineRequest(chatRequest) {
    let con = await handler.connection();
    let declineRequest = await con.query('UPDATE `requests` SET `status` = 1 WHERE `uuid` = ?', [chatRequest.uuid])
    con.end();
    if (!declineRequest) {
        return {
            status: "error",
            message: "The chat request could not be handled. Try again later."
        }
    } else {
        return {
            status: "success",
            message: "You've declined the chat request successfully."
        }
    }
}

/**
 * 
 * @param {String} room - UUID of Room
 * @returns all needed Information of a Room
 */
async function getChatroomInfo(room){
    let data;
    let con = await handler.connection();
    const query = await con.execute('SELECT * FROM `chatrooms` WHERE `uuid` = ?', [room]);
    con.end();
    if (query[0].length == 0) {
        return false
    } else {
        // theres only one room with the id so we return that one immediately
        data = query[0][0]
        // split the allowed user to an working array so we can iterate it later on
        data.alloweduser = data.alloweduser.split(";")
        return query[0][0];
    }
}

module.exports = {
    getChatrooms,
    insertChatRequestToDb,
    checkForSimilarRequest,
    checkforExistingChat,
    getRequests,
    checkForValidUUID,
    handleRequest,
    getChatroomInfo
}