import axios from 'axios';

const API_URL = 'http://localhost:3001/';

class ChatDbAPI {
    constructor() {

    }

    /**
     * 
     * @param {String} uuid of the user
     * @returns an Array with all Chatrooms a user is allowed to join
     */
    async getChatroomsForUser(uuid) {
        return axios.post(API_URL + 'getChatroomsForUser', {
            uuid: uuid,
        }).then(response => {
            console.log(response);
            if (response.status === 200 && response.data.status === "success") {
                return response.data;
            }
        });
    }


    async getChatroomInfo(room) {
        return axios.post(API_URL + 'getChatroomInfo', {
            room: room,
        }).then(response => {
            console.log(response);
            if (response.status === 200 && response.data.status === "success") {
                return response.data;
            }
        });
    }

    /**
     * 
     * @param {String} uuid of the room
     * @returns all messages of a chat (will be optimized later on)
     */
    async getChatHistory(uuid) {
        return axios.post(API_URL + 'getChatHistory', {
            room: uuid,
        }).then(response => {
            console.log(response);
            if (response.status === 200 && response.data.status === "success") {
                return response.data;
            }
        });
    }


    /**
     * 
     * @param {String} uuid_from 
     * @param {String} uuid_to 
     * @returns notice if the request was send
     */
    async sendChatRequest(uuid_from, uuid_to = new Array()) {
        return axios.post(API_URL + 'sendChatRequest', {
            uuid_from: uuid_from,
            uuid_to: uuid_to
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                return response.data;
            }
        });
    }

    /**
     * 
     * @param {String} uuid 
     * @returns Array with all current chat requests for a given user
     */
    async getRequestsForUser(uuid) {
        return axios.post(API_URL + 'getRequestsForUser', {
            uuid: uuid,
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                return response.data;
            }
        });
    }

    /**
     * Appects / Declines a request
     * @param {Object} data {action: "action", request: {}}
     * @returns Object with information about the handling
     */
    async handleRequest(data) {
        return axios.post(API_URL + 'handleRequest', {
            data: data,
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                return response.data;
            }
        });
    }

    /**
     * 
     * @param {String} room uuid of the current room
     * @param {String} user_uuid uuid of the user
     * @returns object with needed info about the room 
     */
    async getChatroomHeaderInfo(room, user_uuid) {
        return axios.post(API_URL + 'getChatroomHeaderInfo', {
            data: {
                room: room,
                user_uuid: user_uuid,
            },
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                return response.data;
            }
        });
    }

    /**
     * Changes a certain setting of a user
     * @param {Object} data {Setting: 'SettingsName', Value: 'value', User: 'uuid'}
     * @returns object with notice if call was successfull
     */
    async changeUserSetting(data) {
        return axios.post(API_URL + 'changeUserSetting', {
            data: data,
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                return response.data;
            }
        })
    }

    /**
     * Gets the current Settings of user from the DB
     * @param {String} uuid 
     * @returns Object with the settings
     */
    async getUserSettings(uuid) {
        return axios.post(API_URL + 'getUserSettings', {
            uuid: uuid,
        }).then(response => {
            console.log(response);
            if (response.status === 200) {
                return response.data;
            }
        })
    }

    async storeNewProfilePicture(formData) {
        return axios.post(API_URL + 'storeNewProfilePicture', formData
        ).then(response => {
            console.log(response);
            if (response.status === 200) {
                return response.data;
            }
        })
    }
}

export default new ChatDbAPI();