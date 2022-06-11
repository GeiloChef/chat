<template>
    <div class="chatRoomParent">
        <div class="chatRoomHeader">
            <ChatRoomHeader v-bind:chatroomInfo="chatroomInfo" />
        </div>
        <div class="chat-history-parent">
            <div class="isTypingInfo" v-if="userTyping.status">
                {{ userTyping.username }} is typing...
            </div>
            <div id="chat-history-child">

                <ChatMessage v-for="message in chatHistory" v-bind:key="message.uuid" v-bind:message="message"
                    v-bind:socket="socket" v-bind:chatroomInfo="chatroomInfo" />
            </div>

        </div>
        <div class="input-parent flex">
            <v-text-field ref="chatMessage" v-model="chatMessage" label="Message" placeholder="" autocomplete="false" outlined clearable
                hide-details="auto" id="test" @input="userIsTyping" @keyup.enter="sendChatMessage">
            </v-text-field>
            <div class="sendBtn flex" @click="sendChatMessage"><span>Send</span></div>
            <!-- <v-btn @keypress.enter="sendChatMessage" @click="sendChatMessage" elevation="5">send</v-btn> -->
        </div>
    </div>
</template>

<script>
import { uuid } from "vue-uuid";

import ChatDbAPI from "@/services/chatdb-api.service.js";

import SocketioService from '../services/socketio.service.ts';
import ChatMessage from '@/components/ChatMessage.vue';
import ChatRoomHeader from "@/components/ChatRoomHeader.vue";

export default {
    name: 'ChatRoom',
    components: {
        ChatMessage,
        ChatRoomHeader
    },
    data: function () {
        let chatHistory = new Array();

        return {
            chatMessage: "",
            chatHistory,
            chatroomInfo: "",
            room: "",
            userTypingTimeout: false,
            userTyping: {
                status: false,
                username: "",
            },
        }
    },
    props: {
        socket: Object,
    },
    methods: {
        sendChatMessage: function () {
            console.log(this.chatMessage);
            if(this.chatMessage === ""){
                return;
            }
            let data = {
                'uuid': uuid.v4(),
                'message': this.chatMessage,
                'sender_uuid': localStorage.getItem('uuid'),
                'sender_username': localStorage.getItem('user'),
                'room': this.$route.params.room,
                'time': Date.now(),
                'seen': 0,
                'chatroom': this.chatroomInfo,
            };

            // send data to socket
            SocketioService.sendChatMessage(data);

            // insert Message into chat
            data.id = Date.now();
            this.chatHistory.push(data);

            // Clear input
            this.chatMessage = "";

            // Keep the input focused (especially for mobile user)
            document.getElementById('test').focus();
        },

        userIsTyping: function () {
            console.log("typing...")
            let data = {
                'chatroom': this.chatroomInfo,
                'user': window.localStorage.getItem('uuid'),
                'username': window.localStorage.getItem('user')
            }
            SocketioService.userIsTyping(data);

        }
    },
    created() {
        // Setup the connection to the chatroom
        this.room = this.$route.params.room;
        window.localStorage.setItem("room", this.room);
        this.socket.emit('createRoom', { 'room': this.room, 'user': window.localStorage.getItem('uuid') });

        // Register the listener to events from the socket
        this.socket.on('broadcast', (data) => {
            this.chatHistory.push(data);
            // clear timeout for the "User is tying" display
            this.userTyping.status = false;
            clearTimeout(this.userTypingTimeout);
            console.log(data);
        })

        this.socket.on('another user is typing', (data) => {
            this.userTyping.status = true;
            this.userTyping.username = data.user;
            if (this.userTypingTimeout) {
                clearTimeout(this.userTypingTimeout)
            }
            this.userTypingTimeout = setTimeout(() => {
                this.userTypingTimeout = false;
                this.userTyping.status = false;
            }, 2500);
            console.log(data);
        })

        this.socket.on('update message history', (data) => {
            console.log(data);
            let newChatHistory = this.chatHistory.map(function (message) {
                let seenStatus = message.seen;
                if (message.uuid === data.message_uuid) {
                    seenStatus = 1;
                    console.log("seen" + message.uuid);
                }
                return {
                    id: message.id,
                    message: message.message,
                    room: message.room,
                    sender_uuid: message.sender_uuid,
                    time: message.time,
                    uuid: message.uuid,
                    seen: seenStatus,
                }
            })
            this.chatHistory = newChatHistory;
        });

        // Get Chatroom Information
        ChatDbAPI.getChatroomInfo(this.$route.params.room).then(response => {
            if (response.status === "success") {
                console.log(response.chatroomInfo);
                this.chatroomInfo = response.chatroomInfo;
                // Get Chat History
                ChatDbAPI.getChatHistory(this.$route.params.room).then(response => {
                    console.log(response.chatHistory)
                    if (response.chatHistory.length > 0) {
                        // Array needs to be reversed to be in the right order in the chat
                        for (let message of response.chatHistory.reverse()) {
                            this.chatHistory.push(message)
                        }
                    }

                });
            } else {
                this.$parent.$emit('triggerAlert', response);
            }

        });

    },
    beforeUnmount() {
        this.socket.emit('leaveRoom', { room: window.localStorage.getItem('room'), user: window.localStorage.getItem('uuid') });
        localStorage.removeItem('room');
        // SocketioService.disconnect();
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.chatRoomParent {
    position: absolute;
    display: flex;
    flex-flow: column;
    height: 100%;

    .chatRoomHeader {
        flex: 0 1 $navBar-height;
    }

    .chat-history-parent {
        flex: 1 1 auto;
    }

    .input-parent {
        flex: 0 1 3rem;
        border-top: 2px solid $cyan-process
    }
}

.chat-history-parent {
    width: 100vw;
    background: $eerie-black;
    padding: 2%;
    display: flex;
    flex-direction: column-reverse;
    overflow: auto;
}

.input-parent {
    flex-wrap: wrap;
}

.sendBtn {
    width: 15vw;
    // border-radius: 0 1rem 1rem 0;
    border-left: 1px solid $cyan-process;
    height: 100%;
}

.isTypingInfo {
    color: $blue-crayola;
    font-size: 120%;
    font-weight: bolder;
    font-style: italic;
    display: flex;
    align-items: flex-end;
}
</style>