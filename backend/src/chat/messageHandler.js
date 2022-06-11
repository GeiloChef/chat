const { randomUUID } = require('crypto');

const handler = require('../handler');

/**
 * 
 * @param {Array} data {text, from, room, time}
 * @returns 
 */
 async function insertMessageToDb(data){
    console.log('Store Message:')
    console.log(data);
    let con = await handler.connection();
    // let uuid = randomUUID();
    const query = await con.query(
        'INSERT INTO `messages` (uuid, room, sender_uuid, message, seen) VALUES (?, ? , ? , ?, ?)',
        [data.uuid, data.room, data.sender_uuid, data.message, false],
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            data.uuid = uuid;
            con.end();
            return data;
        }
    );
}

async function setMessageAsSeen(uuid_message){
    console.log(uuid_message);
    let con = await handler.connection();
    const query = await con.execute('UPDATE `messages` SET `seen` = 1 WHERE uuid = ?',
    [uuid_message]);
    con.end();
    if(query){
        return true;
    }else{
        return false;
    }
}

/**
 * 
 * @param {String} uuid of the room
 * @returns all chat messages of a certain room (will be optimized for faster loading)
 */
async function getChatHistory(uuid){
    let con = await handler.connection();
    const query = await con.execute('SELECT * FROM `messages` WHERE `room` = ? ORDER BY `id` DESC LIMIT 40', [uuid]);
    con.end();
    if(query[0].length == 0){
        return false
    }else{
        return query[0];
    }
}

module.exports = {
    insertMessageToDb,
    getChatHistory,
    setMessageAsSeen
}