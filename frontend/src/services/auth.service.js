import axios from 'axios';

const API_URL = process.env.VUE_APP_BACKEND_URL || "/";

class AuthService {
    constructor() {

    }
    async login(user) {
        console.log(API_URL);
        return axios.post(API_URL + 'login', {
            email: user.email,
            password: user.password,
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.response);
            return{
                status: "error",
                message: "We couldn't verify your Login. Please try again later."
            }
        });
    }

    async signup(user) {
        return axios.post(API_URL + 'signup', {
            username: user.username,
            email: user.email,
            password: user.password,
        }).then(response => {
            if (response.status === 200) {
                return response.data;
            }
        }).catch(error => {
            console.log(error.response);
            return{
                status: "error",
                redirect: false,
                message: "Account couldn't be created, try again later."
            }
        });
    }

    async verifyToken(token, uuid) {
        return axios.post(API_URL + 'verifyToken', {
            token: token,
            uuid: uuid
        }).then(response => {
            if (response.status === 200) {
                return response.data;
            }
        });
    }
}

export default new AuthService();