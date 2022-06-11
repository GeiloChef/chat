<template>
    <div class="auth-parent">
        <div>
            <h1 class="section-header">Sign Up</h1>
            <div v-if="showForm">
                <Form @submit="handleSignup" :validation-schema="schema">
                    <div class="input-parent flex">
                        <div class="input-child flex">
                            <Field v-model="username" name="username" type="text" value="" placeholder="Username" />
                            <ErrorMessage name="username" />
                        </div>
                        <div class="input-child flex">
                            <Field v-model="email" name="email" type="text" value="" placeholder="E-Mail Adress"/>
                            <ErrorMessage name="username" />
                        </div>
                        <div class="input-child flex">
                            <Field name="password" type="text" value="" placeholder="Password"/>
                            <ErrorMessage name="password" />
                        </div>
                        <div class="button-child flex">
                            <button class="flex" :disabled="loading">
                                <span>Signup</span>
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
            <div class="loading">
                <v-progress-circular v-if="loading" indeterminate color="white" :size="50"></v-progress-circular>
            </div>
            <div v-if="showForm" class="auth-link flex">
                <router-link to="/login">
                    You already have an Account? Log in now!
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
    name: 'SignUp',
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data: function () {
        const schema = yup.object().shape({
            username: yup.string().required("Username is required!"),
            email: yup.string().required("E-Mail adress is required!"),
            password: yup.string().required("Password is required!"),
        })
        return {
            loading: false,
            showForm: true,
            message: "",
            schema,
            username: "",
        };
    },
    methods: {
        handleSignup(user) {
            this.loading = true;
            this.showForm = false;
            AuthService.signup(user).then(response => {
                console.log(response);
                this.$parent.$emit('triggerAlert', response);
                if(response.status === "success" || response.redirect !== false){
                    this.$router.push("/login");
                }
                this.loading = false;
                this.showForm = true;
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