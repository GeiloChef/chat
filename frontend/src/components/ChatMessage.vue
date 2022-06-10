<template>
    <div :class="messageClass" class="message-container">
        <!-- <v-expand-transition mode="in" hide-on-leave="false"></v-expand-transition> -->
        <span class="message">
            {{ message.message }}
        </span>

        <div class="message-info flex">
            <span class="time">
                {{ timeSent }}
            </span>
            <div class="message-status">
                <img class="message-status-img" :src="displayed_icon" />
            </div>
        </div>

    </div>

</template>
<script>
export default {
    name: 'ChatMessage',
    data: function () {
        return {
            messageClass: "",
            timeSent: "",
            messageSent_icon: require("@/assets/icons/message_sent-white.png"),
            messageSeen_icon: require("@/assets/icons/message_seen-white.png"),
            displayed_icon: "",
        }
    },
    props: {
        message: Object,
        chatroomInfo: Object,
        socket: Object,
    },
    created() {
        if (this.message.sender_uuid === localStorage.getItem('uuid')) {
            this.messageClass = 'ownMessage';
            if (this.message.seen === 0) {
                this.displayed_icon = this.messageSent_icon;
            } else {
                this.displayed_icon = this.messageSeen_icon;
            }
        } else {
            this.messageClass = 'foreignMessage';
            if (this.message.seen === 0 || this.message.seen === "0") {
                this.socket.emit('message seen',
                    {
                        'message': this.message.uuid,
                        'room': this.chatroomInfo,
                    });
            }
        }
        let timestamp = new Date(this.message.time);
        this.timeSent = `${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}`
    },
    beforeUpdate(){
        if (this.message.sender_uuid === localStorage.getItem('uuid')) {
            this.messageClass = 'ownMessage';
            if (this.message.seen === 0) {
                this.displayed_icon = this.messageSent_icon;
            } else {
                this.displayed_icon = this.messageSeen_icon;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.message-container {
    position: relative;
    width: 70%;
    color: black;
    padding: 2%;
    margin: 2% 0%;
    border-radius: 12px;
}

.ownMessage {
    background-color: lightgreen;
    float: right;
    border-bottom-right-radius: 0px;
}

.foreignMessage {
    background-color: lightgreen;
    float: left;
    border-top-left-radius: 0px;
}

.message {
    width: 100%;
    display: block;
}

.message-info {
    flex-wrap: wrap;
    margin-bottom: -2%;
}

.time {
    // position: absolute;
    // bottom: 1%;
    // right: 3%;
    flex: 1;
    text-align: right;
}

.message-status {
    height: 1.5rem;
    float: right;
    margin-left: 2%;

    img {
        height: 100%;
        opacity: 0.7;
    }
}
</style>