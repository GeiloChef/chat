<template>
    <div>
        <router-link :to="{ name: 'ChatRoom', params: { room: chat.uuid } }">
            <div class="chatListParent">
                <div class="chatList-img">
                    <img :src="image" />
                </div>
                <div class="roomInfoParent">
                    <span class="chatListName">{{ chat.roomname }}</span>
                    <span v-if="this.chat.isTyping" class="isTyping">is typing...</span>
                    <span v-if="!this.chat.isTyping" class="lastMessage" :class="chat.lastMessage.class"> {{ sender }} {{
                            chat.lastMessage.message
                    }}</span>
                </div>
            </div>
        </router-link>
    </div>
</template>
<script>

export default {
    name: 'ChatRoomList',
    data: function () {
        let linkToImages = "http://localhost:3001/pp/"
        return {
            image: linkToImages + this.chat.image,
            sender: "",
        }
    },
    props: {
        chat: Object
    },
    created() {
        console.log("created");
        // generate last message display
        if (this.chat.lastMessage.sender_uuid === window.localStorage.getItem("uuid")) {
            this.sender = "You:";
        } else {
            this.sender = "";
        }
        // Display Typing info
        console.log(this.chat.isTyping);
        if (this.chat.isTyping) {
            clearTimeout(this.isTypingTimeout);
            this.displayIsTyping = true;
            this.isTypingTimeout = setTimeout(() => {
                this.displayIsTyping = false;
            }, 2400);
        }
    },
}
</script>
<style lang="scss" scoped>
@import "@/assets/variables.scss";

a {
    text-decoration: none !important;
    color: white;
}

.chatListName {
    color: $cyan-process;
    font-size: 125%;
    font-weight: bolder;
}

.roomInfoParent {
    display: grid;
}

.isTyping {
    color: $cyan-process
}

.unseen {
    color: $cyan-process;
    font-size: 100%;
    font-weight: bolder;
    font-style: italic;
}

.lastMessage {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>