<template>
    <div>
        <div v-if="(!showMessage)">
            <ChatRoomLink v-for="chat in chats" v-bind:key="chat.uuid" v-bind:chat="chat" />
        </div>
        <div v-if="(showMessage)" class="messageParent flex">
            <div class="messageChild">
                <span>You currently dont have any active chat with other users. Invite your friends
                    to chat with you now!
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import ChatDbAPI from "@/services/chatdb-api.service.js";

import ChatRoomLink from "@/components/ChatRoomLink.vue";
export default {
    name: 'ActiveChats',
    components: {
        ChatRoomLink,
    },
    props: {
        socket: Object,
    },
    data: function () {
        let chats;
        return {
            chats,
            showMessage: false,
        }
    },
    methods: {
    },
    created() {
        this.socket.on('notify room typing', (data) => {
            let newChats = this.chats.map(function (chat) {
                if (chat.uuid === data.room) {
                    if (chat.isTypingTimeout) {
                        clearTimeout(chat.isTypingTimeout);
                    }
                    chat.isTyping = true;
                    chat.isTypingTimeout = setTimeout(() => {
                        chat.isTyping = false;
                    }, 2400);
                }
                return chat;
            })
            this.chats = newChats;
            console.log(this.chats);
        });

        this.socket.on('notify new message', (data) => {
            let newChats = this.chats.map(function (chat) {
                if (chat.uuid === data.room) {
                    if (chat.isTypingTimeout) {
                        clearTimeout(chat.isTypingTimeout);
                    }
                    chat.isTyping = false;
                    chat.lastMessage = data;
                    chat.lastMessage.class = "unseen";
                }
                chat.lastMessage.time = new Date(chat.lastMessage.time);
                return chat;
            })
            this.chats = newChats.sort((a, b) => (a.lastMessage.time < b.lastMessage.time) ? 1 : ((b.lastMessage.time < a.lastMessage.time) ? -1 : 0));
            console.log(this.chats);
        });

        this.socket.on('notify seen message', (data) => {
            console.log("notify seen message" + data);
        });
    },
    mounted() {
        let uuid = localStorage.getItem("uuid");
        ChatDbAPI.getChatroomsForUser(uuid).then(response => {
            console.log(response.roomsActive)
            if (response.roomsActive.length > 0) {
                let newChats = response.roomsActive.map(function (chat) {
                    if (chat.lastMessage.seen === 0) {
                        chat.lastMessage.class = "unseen";
                    }
                    return chat;
                })
                this.chats = newChats.sort((a, b) => (a.lastMessage.time < b.lastMessage.time) ? 1 : ((b.lastMessage.time < a.lastMessage.time) ? -1 : 0));
                this.showMessage = false;
            } else {
                this.showMessage = true;
            }
        })
    }
}
</script>

<style lang="scss" scoped>
.messageParent {
    height: 65vh
}

.messageChild {
    width: 80%;
    font-size: 120%;
    text-align: center;
    font-weight: bolder;
}
</style>