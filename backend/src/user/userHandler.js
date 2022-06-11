
const { randomUUID } = require('crypto');
const handler = require('../handler');
const sharp = require('sharp');

/**
 * 
 * @param {String} uuid 
 * @returns Object with all information about a user
 */
async function getUserFromUUID(uuid) {
    let con = await handler.connection();
    const query = await con.execute('SELECT * FROM `user` WHERE `uuid` = ?', [uuid]);
    con.end();
    if (query[0].length == 0) {
        return false
    } else {
        // theres only one user per UUID so we can send the first object of the array
        return query[0][0];
    }
}

/**
 * Edits the Setting of a user
 * @param {String} setting 
 * @param {String} value 
 * @param {String} uuid of the user 
 * @returns Boolean
 */
async function changeSetting(setting, value, uuid) {
    let con = await handler.connection();
    const query = await con.execute('UPDATE `user` SET `' + setting + '` = ? WHERE uuid = ?',
        [value, uuid]);
    con.end();
    if (query) {
        return true;
    } else {
        return false;
    }
}


/**
 * Stores a image in the DB
 * @param {String} filename 
 * @param {String} uuid of user
 * @returns Boolean
 */
 async function saveProfileImagetoDb(filename, uuid) {
    let con = await handler.connection();
    const query = await con.execute('UPDATE `user` SET `image` = ? WHERE uuid = ?',
        [filename, uuid]);
    con.end();
    if (query) {
        return true;
    } else {
        return false;
    }
}

async function processImageUpload(image, filename, user) {
    let dataSend;
    await sharp(image).metadata().then(({ width }) =>
        sharp(image).resize(Math.round(width * 0.5))
            .webp({ effort: 6 })
            .toFile(`./public/uploads/profilepictures/${filename}`, async (err) => {
                if (err) {
                    return dataSend = {
                        status: "error",
                        message: "Your profile picture could not be save.Please try again later.",
                    }
                } else {
                    const saveToDb = await saveProfileImagetoDb(filename, user);
                    return dataSend = {
                        status: "success",
                        message: "Your new profile picture was saved successfully.",
                        image: filename,
                    };
                }
            })
    );
    return dataSend;
}



module.exports = {
    getUserFromUUID,
    changeSetting,
    saveProfileImagetoDb,
    processImageUpload,
}