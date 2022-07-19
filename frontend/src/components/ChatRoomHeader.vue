<template>
    <div>
        <div class="chatRoomHeaderParent flex">
            <div @click="$router.go(-1)" class="goBack">
                <img :src="goBack_Icon" />
            </div>
            <div class="profilePicture">
                <img :src="room_image" />
            </div>
            <div class="chatRoomName">
                {{ room_name }}
            </div>
            <!-- <div class="openMenu">
                <img :src="openMenu_Icon" />
            </div> -->
        </div>
    </div>

</template>


<script>
import ChatDbAPI from "@/services/chatdb-api.service.js";


export default {
    name: "ChatRoomHeader",
    data: function () {
        return {
            goBack_Icon: require("@/assets/icons/arrow_left-white.png"),
            openMenu_Icon: require("@/assets/icons/3-dots-icon-white.png"),
            room_name: "",
            room_image: "",
        }
    },
    components: {
        LightBox
    },
    props: {
        chatroomInfo: Object,
    },
    created() {
        ChatDbAPI.getChatroomHeaderInfo(this.$route.params.room, window.localStorage.getItem("uuid")).then(response => {
            if (response.status === "success") {
                console.log(response)
                this.room_name = response.room_name;
                const API_URL = process.env.VUE_APP_BACKEND_URL || "/"
                let linkToImages = API_URL + "pp/"
                this.room_image = linkToImages + response.room_image;
            } else {
                this.$parent.$emit('triggerAlert', response);
            }

        });
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.chatRoomHeaderParent {
    // flex-wrap: wrap;
    $goBack_width: 2rem;
    $openMenu_width: 1rem;

    padding: 0.5rem;

    .goBack {
        width: $goBack_width;

        img {
            max-width: 100%;
        }
    }

    .profilePicture {
        width: $profilePicture_width;
        height: $profilePicture_width;
        border-radius: 100%;
        overflow: hidden;
        border: 2px solid $cyan-process;
        margin: 0 1rem;

        img {
            max-width: 100%;
        }
    }

    .chatRoomName {
        width: calc(100% - $goBack_width - $profilePicture_width - $openMenu_width);
        font-size: 120%;
    }

    .openMenu {
        width: $openMenu_width;

        img {
            width: 100%;
        }
    }
}
</style>