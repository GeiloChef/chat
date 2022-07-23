import authService from "@/services/auth.service";

import { createWebHashHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import NotFound from "@/views/NotFound.vue";
import Chats from "@/views/Chats.vue";
import ChatRoom from "@/views/ChatRoom.vue";
import Settings from "@/views/Settings.vue";
import DesktopInformation from "@/views/DesktopInformation.vue";

// import { def } from "@vue/shared";

const routes = [
    {
        path: "/",
        name: "Home",
        // component: Login,
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
        path: "/desktop",
        name: "DesktopInformation",
        component: DesktopInformation,
        needLogin: false,
    },
    {
        path: "/:catchAll(.*)",
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    /**
     * Check if is Mobile, otherwise redirect to a info page
     * that the site is only available on mobile
     */
    if (to.name === "Home") {
        next({ 'name': 'Login' });
    }

    if (to.name !== 'DesktopInformation' &&
        !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        next({ 'name': 'DesktopInformation' });
        console.log('redirect desktop')
    } else {
        next();
    }
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        /**
        * Redirect a User if his JWT Token is not valid
        */
        console.log("mobile Usage");
        if (to.name === 'DesktopInformation') return
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
    }
});

export default router;


