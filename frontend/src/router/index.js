import authService from "@/services/auth.service";

import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import NotFound from "@/views/NotFound.vue";
import Chats from "@/views/Chats.vue";
import ChatRoom from "@/views/ChatRoom.vue";
import Settings from "@/views/Settings.vue";

// import { def } from "@vue/shared";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        needLogin: true,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/signup",
        name: "Signup",
        component: Signup,
    },
    {
        path: "/chats",
        name: "Chats",
        component: Chats,
        needLogin: true,
    },
    {
        path: "/chatRoom/:room",
        name: "ChatRoom",
        component: ChatRoom,
        needLogin: true,
    },
    {
        path: "/settings",
        name: "Settings",
        component: Settings,
        needLogin: true,
    },
    {
        path: "/:catchAll(.*)",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    /**
     * Redirect a User if his JWT Token is not valid
     */
    if (to.name !== 'Login' && to.name !== 'Signup') {
        if (!window.$cookies.get("token") || !localStorage.getItem("uuid")) {
            next({ 'name': 'Login' });
            return;
        }
            authService.verifyToken(window.$cookies.get("token"), localStorage.getItem("uuid")).then(response => {
                if (response.status === "success") {
                    next();
                } else {
                    next({ 'name': 'Login' });
                }
                console.log(response)
            });
    } else {
        next();
    }
});

export default router;


