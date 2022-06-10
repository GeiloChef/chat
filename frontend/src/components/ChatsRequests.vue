<template>
    <div>
        <div v-if="(requests.length > 0)">
            <ChatRequestLink v-for="request in requests" v-bind:key="request.id" v-bind:request="request"
                @handleRequest="handleRequest" />
        </div>
        <div v-if="(requests.length === 0)" class="messageParent flex">
            <div class="messageChild">
                <span>You currently dont have any chat requests from other users. Invite your friends
                    to chat with you now!
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import ChatDbAPI from "@/services/chatdb-api.service.js";

import ChatRequestLink from "@/components/ChatRequestLink.vue";
export default {
    name: "ChatRequests",
    components: {
        ChatRequestLink
    },
    data: function () {
        let requests = new Array();
        return {
            requests,
            showMessage: false,
        }
    },
    methods: {
        handleRequest: function (data) {
            console.log(data);
            console.log(`${data.action} request ${data.request.uuid}`)
            ChatDbAPI.handleRequest(data).then(response => {
                console.log(response);
                if (response.requests) {
                    this.requests = response.requests;
                    this.showMessage = false
                }else{
                    this.requests = "";
                    this.showMessage = true;
                }
            })
        },
        copyFromClipboard: function () {
            console.log("This will insert from clipboard");
        },
        sendRequest: function () {
            if (this.newRequestUserUUID) {
                console.log(this.newRequestUserUUID);
            }
        }
    },
    mounted() {
        let uuid = localStorage.getItem("uuid");
        ChatDbAPI.getRequestsForUser(uuid).then(response => {
            console.log(response);
            if (response.requests) {
                this.requests = response.requests;
            }
        })
    },
}
</script>

<style lang="scss" scoped>
.messageParent{
    height: 65vh
}

.messageChild{
    width: 80%;
    font-size: 120%;
    text-align: center;
    font-weight: bolder;
}
</style>