<template>
    <div>
        <router-link :to="{ name: 'ChatRoom', params: { room: chat.uuid } }">
            <div class="chatListParent">
                <div class="chatList-img">
                    <img :src="image" />
                </div>
                <div class="roomInfoParent">
                    <div>
                        <span class="chatListName">{{ chat.roomname }}</span>
                        <span class="time"> {{ chatroomTime }}</span>
                    </div>
                    <span v-if="this.chat.isTyping" class="isTyping">is typing...</span>
                    <span v-if="!this.chat.isTyping" class="lastMessage" :class="chat.lastMessage.class"> {{ sender }}
                        {{
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
            chatroomTime: "",
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
        // Generate Display for time & Date in the chat overview
        let time = new Date(this.chat.time)
        let timeString = String(time.getHours()).padStart(2, '0') + ":" + String(time.getMinutes()).padStart(2, '0')
        let now = new Date(Date.now())
        if( time.getDate() !== now.getDate() || time.getMonth() !== now.getMonth() || time.getFullYear() !== now.getFullYear() ){
            timeString = String(`${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()} `) + timeString;
        } 
        this.chatroomTime = timeString;
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
    flex: 1;
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
.time{
        float: right;
    margin-right: 1rem;
}

</style>