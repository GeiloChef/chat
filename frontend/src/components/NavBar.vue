<template>
    <div class="navBar flex">
        <router-link v-if="(origin_info.name === 'settings')" class="goBack" :to="{ name: 'Chats' }">
            <img :src="back_icon" />
        </router-link>
        <span class="navBar-span">{{ headline }}</span>
        <router-link v-if="(origin_info.name === 'chats')" class="settings" :to="{ name: 'Settings' }">
            <img :src="settings_icon" />
        </router-link>
    </div>
</template>
<script>
export default {
    name: "NavBar",
    data: function () {

        return {
            headline: "",
            back_icon: require("@/assets/icons/arrow_left-white.png"),
            settings_icon: require("@/assets/icons/settings-white.png"),
        }
    },
    props: {
        origin_info: Object,
    },
    created() {
        switch (this.origin_info.name) {
            case "chats":
                this.headline = "Chats"
                break;
            case "settings":
                this.headline = "Settings"
                break;
            default:
                this.headline = "Please assign a Name in the parent Component."
                break;
        }
    }
}
</script>
<style lang="scss" scoped>
.settings,
.goBack {
    width: 2rem;
    height: 2rem;
    position: absolute;

    img {
        width: 100%;
    }
}

.settings {
    right: 1rem;
}

.goBack {
    left: 1rem;
}
</style>