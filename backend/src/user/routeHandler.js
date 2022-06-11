const userHandler = require('./userHandler');
const { randomUUID } = require('crypto');
const sharp = require('sharp');

/**
 * Edits the given setting in the user DB
 * @param {*} req 
 * @param {*} res 
 */
async function changeUserSetting(req, res) {
    let sendData;
    const { data } = req.body;
    const changeSetting = await userHandler.changeSetting(data.setting, data.value, data.uuid);
    if (changeSetting) {
        sendData = {
            status: "success",
            message: "Successfully saved!",
        }
    } else {
        sendData = {
            status: "error",
            message: "Could not be saved, try again!"
        }
    }
    res.send(sendData).end();
}

/**
 * Gets all Settings of a given user
 * @param {*} req includes the uuid of a user
 * @param {*} res 
 */
async function getUserSettings(req, res) {
    const { uuid } = req.body;
    const settings = await userHandler.getUserFromUUID(uuid);
    if (settings) {
        res.send({
            status: "success",
            username: settings.username,
            email: settings.email,
            image: settings.image,
            uuid: settings.uuid,
        }).end();
    } else {
        res.send({
            status: "error",
            message: "Your Settings could not be retrieved. Please reload the page.",
        }).end();
    }
}

async function storeNewProfilePicture(req, res) {
    if (!req.files) {
        console.log('no Files');
    }

    const uploadedFileBuffer = req.files.file.data;
    const user = req.body.useruuid;

    const uuid = randomUUID();
    const filename = user + "_" + uuid + ".webp";

    await sharp(uploadedFileBuffer).metadata().then(({ width }) =>
        sharp(uploadedFileBuffer).resize(Math.round(width * 0.5))
            .webp({ effort: 6 })
            .toFile(`./public/uploads/profilepictures/${filename}`, async (err) => {
                if (err) {
                    res.send({
                        status: "error",
                        message: "Your profile picture could not be save.Please try again later.",
                    }).end();
                } else {
                    const saveToDb = await userHandler.saveProfileImagetoDb(filename, user);
                    res.send({
                        status: "success",
                        message: "Your new profile picture was saved successfully.",
                        image: filename,
                    }).end()
                }
            })
    );
}

module.exports = {
    changeUserSetting,
    getUserSettings,
    storeNewProfilePicture
}