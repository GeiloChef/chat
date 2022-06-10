const axios = require('axios');

const API_URL = "http://localhost:3001/"

async function sendMessageToAPI(data) {
    axios.post(API_URL + "storeMessage", { data: data }).then(response => {
        console.log('Message stored successfully');
        return response;
    })
        .catch(error => {
            console.log(error);
            return error;
        });
}

async function setMessageAsSeen(uuid_message){
    await axios.post(API_URL + "setMessageAsSeen", {uuid_message: uuid_message}).then(response => {
        return true;
    }).catch(error => {
        console.log("error");
        console.log(error);
        return false;
    });
}

async function getUsernameFromAPI(uuid) {
    await axios.post(API_URL + "getUsernameFromUUID", {uuid : uuid}).then(response => {
        console.log("username:" + response.data.username.username);
        return response.data.username.username;
    }).catch(error => {
        console.log("error");
        console.log(error);
        return error;
    });
}

module.exports = {
    sendMessageToAPI,
    getUsernameFromAPI,
    setMessageAsSeen
}