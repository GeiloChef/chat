<template>
    <div>
        <button @click="newRequestClicked = !newRequestClicked" class="newRequestButton">
            <img :src="newRequestButtomImage" alt="+" />
        </button>
        <div class="newRequestModalParent flex">
            <v-scale-transition mode="in" hide-on-leave origin="bottom right 0">
                <div v-if="newRequestClicked" key="1" class="newRequestModalChild">
                    <span>Send a new chat request</span>
                    <v-text-field class="text-caption" color="secondary" label="Contained" variant="contained"
                        placeholder="User UUID" v-model="newRequestUserUUID"></v-text-field>
                    <button @click="sendRequest">Send</button>
                </div>
            </v-scale-transition>
        </div>


    </div>
</template>

<script>
import ChatDbAPI from "@/services/chatdb-api.service.js";

export default {
    name: "ChatRequestNew",
    data: function () {
        return {
            newRequestButtomImage: require("@/assets/icons/plus_white.png"),
            newRequestClicked: false,
            newRequestUserUUID: "",
        }
    },
    methods: {
        sendRequest() {
            console.log(this.newRequestUserUUID);
            if (this.newRequestUserUUID !== localStorage.getItem("uuid") && this.newRequestUserUUID !== "" && this.newRequestUserUUID) {
                ChatDbAPI.sendChatRequest(localStorage.getItem("uuid"), this.newRequestUserUUID).then(response => {
                    this.$parent.$emit('triggerAlert', response);
                });
            }
        },
        hideNewRequestModal(){
            this.newRequestClicked = (this.newRequestClicked) ? false : true
        }
    }
}
</script>

<style lang="scss">
@import "@/assets/variables.scss";

$newRequestButotn-padding: 2rem;

.newRequestButton {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    width: 15vw;
    height: 15vw;
    padding: 0.8rem;
    border-radius: 100%;
    background: $blue-crayola;

    img {
        max-width: 100%;
        max-height: 100%;
    }
}

.newRequestModalChild {
    width: 100vw;
}

.newRequestModalChild {
    background: $blue-crayola;
    color: white;
    position: absolute !important;
    ;
    bottom: 6rem;
    width: 80%;
    border-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    padding: 2rem;

    span {
        width: 100%;
        font-size: 120%;
        text-align: center;
        margin-bottom: 1rem;
    }

    input {
        background: white;
        width: 100%;
        height: 2rem;
        font-size: 1.6rem;
    }

    button {
        width: 100%;
        height: 2rem;
        background: $cyan-process;
        color: white;
    }
}
</style>