<template>
    <div class="chatsOverviewParent">
        <div class="header-content">
            <NavBar v-bind:origin_info="origin_info" />
        </div>
        <v-tabs v-model="register">
            <v-tab v-for="site in sites" v-bind:key="site.name">
                {{ site.name }}
            </v-tab>
        </v-tabs>
        <!-- Content -->
        <v-window v-model="register" >
            <v-window-item v-for="site in sites" v-bind:key="site.name">
                <component v-bind:socket="socket" v-bind:is="site.content" v-bind:activeChats="activeChats" @updateChats="updateChats">
                </component>
            </v-window-item>
        </v-window>
        <ChatRequestNew />

    </div>
</template>
<script>
import NavBar from "@/components/NavBar.vue";
import ActiveChats from "@/components/ChatsActive.vue";
import ChatRequests from "@/components/ChatsRequests.vue";
import ChatRequestNew from "@/components/ChatRequestNew.vue";


export default {
    // eslint-disable-next-line
    name: 'Chats',
    components: {
        NavBar,
        ChatRequestNew
    },
    props: {
        socket: Object,
    },
    data: function () {
        let chats;
        let origin_info = {
            name: "chats",
        }
        let sites = [
            { name: 'Active Chats', content: ActiveChats },
            { name: 'Chat Requests', content: ChatRequests },
        ];
        let activeChats = new Array();
        return {
            register: null,
            chats,
            sites,
            activeChats,
            origin_info
        }
    }
}


</script>

<style lang="scss" scoped>
.chatsOverviewParent {
    width: 100%;
    height: 100%;
}
</style>
