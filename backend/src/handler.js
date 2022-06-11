/**
 * Contains comman functions for reuseability
 */

const mysql = require('mysql2/promise');


/**
 * @param  {Array} array
 * @param  {String} key (name of key to look for)
 * @param  {String} lookup
 * @retuns key of array if object exists
 * @returns -1 if object doesn't exist
 */
 function isObjectInArray(array, key, lookup) {

    // get the index of the key. returns -1 if room is not existend
    const isInArray = array.findIndex(array => {
        if (array[key] === lookup) {
            return true;
        }
        return false;
    });
    console.log(isInArray);
    return isInArray;
}

/**
 * 
 * @returns connection to db
 * requires module mysql2
 */
 const connection = async function () {
    return mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'chat',
    });
}

module.exports = {
    isObjectInArray,
    connection,
}