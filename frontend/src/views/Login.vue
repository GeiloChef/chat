<template>
    <div class="auth-parent">
        <div>
            <h1 class="section-header">Login</h1>
            <div v-if="showForm">
                <Form @submit="handleLogin" :validation-schema="schema">
                    <div class="input-parent flex">
                        <div class="input-child flex">
                            <Field name="email" type="text" value="1@1.de" />
                            <ErrorMessage name="email" />
                        </div>
                        <div class="input-child flex">
                            <Field name="password" type="text" value="password1" />
                            <ErrorMessage name="password" />
                        </div>
                        <div class="button-child flex">
                            <button class="flex" :disabled="loading">
                                <span v-if="!loading">Login</span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <div v-if="message" role="alert">
                            {{ message }}
                        </div>
                    </div>
                </Form>
            </div>
            <div class="loading">
                <v-progress-circular v-if="loading" indeterminate color="white" :size="50"></v-progress-circular>
            </div>
            <div v-if="showForm" class="auth-link flex">
                <router-link to="/signup">
                    No Account yet? Sign up now!
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import AuthService from "@/services/auth.service.js";

export default {


    // eslint-disable-next-line
    name: 'Login',
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data: function () {
        const schema = yup.object().shape({
            email: yup.string().required("E-Mail is required!"),
            password: yup.string().required("Password is required!"),

        })
        return {
            showForm: true,
            loading: false,
            message: "",
            schema,
        };
    },
    methods: {
        handleLogin(user) {
            this.loading = true;
            this.showForm = false;
            console.log(user);
            AuthService.login(user).then(response => {
                /**
                 * If a User is logged in successfully, we set some items to the local Storage
                 * and some cookies and redirect him to the landing page
                 */
                if (response.status === "success") {
                    // Emit the username to the landing page?? neccessary anymore?
                    this.$emit('setUsername', response.username);
                    // Setup the socket connection for a user
                    console.log(`connecting as ${response.uuid}`)
                    this.$emit('connectToUserSocket', response.uuid);
                    
                    // Set Cookies and localStorage
                    let expires = new Date(Date.now() + response.expires).toUTCString();
                    document.cookie = "token=" + response.token + ";expires=" + expires + ";path=/";
                    window.localStorage.setItem("user", response.username);
                    window.localStorage.setItem("uuid", response.uuid);
                    console.log(response.username);
                    // after a success login a user will get redirected to the chat
                    this.$router.push("/chats");
                } else {
                    /**
                     * If the Login was unsuccessfull we active the From again so the
                     * user can try once more.
                     */
                    console.log(response)
                    this.$parent.$emit('triggerAlert', response);
                    this.loading = false;
                    this.showForm = true;
                }

            });
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";



h1.section-header {
    font-size: 5rem;
    height: 10rem;
    text-align: center;
}

.input-parent {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.input-child {
    width: 100%;
}

input {
    border: 1px solid $cyan-process;
    color: $cyan-process;
    width: 80%;
    margin: 2% 8%;
    padding: 6%;
    border-radius: 32px;
    height: 3rem;
    background: $eerie-black;
    color: white;
    font-weight: bold;
}

.button-child {
    width: 100%;
}

.loading{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
    background: $blue-crayola;
    border: 1px solid white;
    border-radius: 32px;
    width: 50%;
    margin: 2% 8%;
    color: white;
    height: 3rem;
}
</style>