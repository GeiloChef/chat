import { io } from 'socket.io-client';

class SocketioService {
    socket;
    constructor() {

    }

    /**
     * Sets up a socket connection for a certain user and
     * creates a fitting room
     * @param room (UUID)
     * @returns 
     */
    setupSocketConnection(room){
        let token = window.$cookies.get("token");
        console.log(token);


        // this.socket = io('http://localhost:3000')
        this.socket = io('http://localhost:3000', {
            query: {token},
        })

        this.socket.emit('createRoom', {'room': room, 'user': window.localStorage.getItem('uuid') });
        // this.socket.emit('my message', 'Hello there from Vue.');
    
        // this.socket.on('broadcast', function (data) {
        //     console.log("Broadcast:");
        //     console.log(data);
        // })

        this.socket.on('roomJoinError', (data) => {
            console.log(data)
        })
        return this.socket;
    }
    /**
     * 
     * @param data = {message, roomid, userid, time, chatroominfo} 
     */
    sendChatMessage(data){
        this.socket.emit('chat message', data);
    }

    userIsTyping(data){
        this.socket.emit('user is typing', data);
    }


    disconnect() {
        if(this.socket){
            this.socket.disconnect();
        }
    }
}

export default new SocketioService;