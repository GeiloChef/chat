const mysql = require('mysql2/promise');
const { randomUUID } = require('crypto');

const handler = require('../handler');



/**
 * Checks, if mail exists in the Database
 * @param {String} email 
 */
async function userExists(email) {
    let con = await handler.connection();
    const query = await con.execute('SELECT * FROM `user` WHERE `email` = ?', [email]);
    con.end();
    if(query[0].length > 0){
            // user exists
            return true;
        }else{
            return false;
        }
}

/**
 * Creates a new user
 * @param {Array} data [username, email, passwordHash]
 */
async function insertNewUser(data) {
    let con = await handler.connection();
    let uuid = randomUUID();
    let randomNumForProfilePic = Math.ceil(Math.random() * 7) // random num from 1 - 7
    let image = "default/" + randomNumForProfilePic + ".webp";
    con.query(
        'INSERT INTO `user` (uuid, email, username, password, image) VALUES (?, ? , ? , ?, ?)',
        [uuid, data.email, data.username, data.passwordHash, image],
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            con.end();
        }
    );
}

/**
 * 
 * @param {String} email 
 * @returns "{uuid: uuid of user, password: hashed user password, username: username}"
 */
async function getPasswordHashFromDb(email){
    let con = await handler.connection();
    const query = await con.execute('SELECT `uuid`, `password`, `username` FROM `user` WHERE `email` = ?', [email]);
    con.end();
    if(query[0].length == 0){
        return false
    }else{
        return query[0][0];
    }
}



module.exports = {
    userExists,
    insertNewUser,
    getPasswordHashFromDb
}