<template>
    <div class="settings-profile-parent settings-card flex">
        <div class="settings-card-headline">
            Profile
        </div>
        <!-- image -->
        <div class="image-parent flex">
            <div class="relative">
                <div class="image-child">
                    <img class="profile-picture" :src="profilePicture" alt="Profile Picture" />
                </div>
                <!-- Hidden Input to handle the Upload -->
                <input type="file" ref="profilePicture" accept="image/png, image/jpeg" style="display:none"
                    @change="handleProfilePictureUpload()" />
                <div class="porfile-picture-edit-icon-parent flex" @click="$refs.profilePicture.click()">
                    <img :src="edit_icon" />
                </div>
            </div>
        </div>
        <!-- Username -->
        <div class="input-parent">
            <div class="input-child">
                <v-text-field :disabled="showIcon.username.edit" v-model="username" class="input" label="Username"
                    variant="outlined" :rules="usernameRules" hide-details="auto"></v-text-field>
            </div>
            <img v-if="showIcon.username.edit"
                @click="showIcon.username.edit = !showIcon.username.edit; showIcon.username.save = !showIcon.username.save;"
                class="edit-icon" :src="edit_icon" />
            <img v-if="showIcon.username.save"
                @click="saveUsername(); showIcon.username.edit = !showIcon.username.edit; showIcon.username.save = !showIcon.username.save;"
                class="edit-icon" :src="save_icon" />
        </div>

        <!-- email -->
        <div class="input-parent">
            <div class="input-child">
                <v-text-field :disabled="showIcon.email.edit" v-model="email" class="input" label="E-Mail"
                    variant="outlined" :rules="emailRules" hide-details="auto"></v-text-field>
            </div>
            <img v-if="showIcon.email.edit"
                @click="showIcon.email.edit = !showIcon.email.edit; showIcon.email.save = !showIcon.email.save;"
                class="edit-icon" :src="edit_icon" />
            <img v-if="showIcon.email.save"
                @click="saveEmail(); showIcon.email.edit = !showIcon.email.edit; showIcon.email.save = !showIcon.email.save;"
                class="edit-icon" :src="save_icon" />
        </div>

        <!-- UUID -->
        <div class="input-parent">
            <div class="input-child">
                <v-text-field disabled v-model="uuid_user" class="input" label="Your UUID" variant="outlined"
                    hint="Other users can add you with that UUID." persistent-hint></v-text-field>
            </div>
            <img @click="copyUuidToClipboard()" class="edit-icon" :src="clipboard_icon" />
        </div>

        <SettingsSwitch v-bind:switchInfo="switches.allowRandomChats" />

    </div>
</template>

<script>
import ChatDbAPI from "@/services/chatdb-api.service.js";

import SettingsSwitch from './SettingsSwitch.vue';

export default {
    name: "SettingsProfile",
    components: {
        SettingsSwitch
    },
    data: function () {
        let switches = {
            allowRandomChats: {
                name: "Allow Random Chats",
                description: false,
            }
        }

        let showIcon = {
            username: {
                edit: true,
                save: false
            },
            email: {
                edit: true,
                save: false,
            }

        }

        return {
            edit_icon: require("@/assets/icons/edit-white.png"),
            save_icon: require("@/assets/icons/save-white.png"),
            clipboard_icon: require("@/assets/icons/clipboard-white.png"),
            usernameRules: [
                value => !!value || 'Required.',
                value => (value && value.length >= 3) || 'Min 3 characters',
            ],
            emailRules: [
                value => !value || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'E-mail must be valid'
            ],
            username: "",
            email: "",
            profilePicture: "",
            uuid_user: "",
            switches,
            showIcon
        };
    },

    methods: {
        saveUsername() {
            // console.log(this.username);
            if (this.username.length < 3 || !this.username) {
                this.$parent.$emit('triggerAlert', { status: "error", message: "Your username does not meet the requirements and could not be saved!" });
                return;
            }
            let sendData = {
                setting: "username",
                value: this.username,
                uuid: window.localStorage.getItem("uuid"),
            }
            ChatDbAPI.changeUserSetting(sendData).then(response => {
                this.$parent.$emit('triggerAlert', response);
            })
        },
        saveEmail() {
            if (!this.validateEmail(this.email)) {
                this.$parent.$emit('triggerAlert', { status: "error", message: "Your email does not meet the requirements and could not be saved!" });
                return;
            }
            let sendData = {
                setting: "email",
                value: this.email,
                uuid: window.localStorage.getItem("uuid"),
            }
            ChatDbAPI.changeUserSetting(sendData).then(response => {
                this.$parent.$emit('triggerAlert', response);
            })
        },
        validateEmail(email) {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        },
        handleProfilePictureUpload() {
            let error = false;
            let message;
            let uploadedImage = this.$refs.profilePicture.files[0];
            // Check File Size
            let allowedFileSize = 5; // Size in MegaByte
            let fileSize = Math.round((uploadedImage.size / (1024 * 1024))) // Convert file size to MB to compare
            if (fileSize > allowedFileSize) {
                error = true;
                message = `The chosen file is to big. Please chose a file with max. ${allowedFileSize}MB.`;
            }

            //check file extension
            let extension = uploadedImage.name.split('.').pop();
            if (extension !== "png" && extension !== "jpg" && extension !== "jpeg") {
                error = true;
                message = `The chosen file is not from type Image. Please try again.`
            }

            if (error) {
                this.$parent.$emit('triggerAlert', { status: 'error', message: message });
            } else {
                let formData = new FormData();
                formData.append('file', uploadedImage);
                formData.append('useruuid', window.localStorage.getItem("uuid"));
                ChatDbAPI.storeNewProfilePicture(formData).then(response => {
                    this.$parent.$emit('triggerAlert', response);
                    if (response.status === "success") {
                        let linkToImages = "http://localhost:3001/pp/"
                        let profilePicture = linkToImages + response.image;
                        this.profilePicture = profilePicture;
                    }
                });
            }
        },
        copyUuidToClipboard() {
            var uuid = this.uuid_user;
            navigator.clipboard.writeText(uuid).then(() => {
                this.$parent.$emit('triggerAlert', { status: 'success', message: "Your UUID was copied to your clipboard!" });
            }, function (err) {
                console.log(err);
                this.$parent.$emit('triggerAlert', { status: 'error', message: "Your UUID could not be copied!" });
            });
        }
    },
    mounted() {
        ChatDbAPI.getUserSettings(window.localStorage.getItem("uuid")).then(response => {
            if (response.status === "error") {
                this.$parent.$emit('triggerAlert', response);
            } else {
                this.username = response.username;
                this.email = response.email;
                let linkToImages = "http://localhost:3001/pp/"
                this.profilePicture = linkToImages + response.image;
                this.uuid_user = response.uuid;
            }

        })
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
@import "@/assets/main.scss";

.settings-profile-parent {
    margin-top: 2rem;
    flex-wrap: wrap;
    position: relative;

    .image-parent {
        width: 100%;
        flex-wrap: wrap;


        .image-child {
            position: relative;
            border-radius: 100%;
            overflow: hidden;
            width: 70vw;
            height: 70vw;
            flex: 0 0 auto;

            .profile-picture {
                width: 100%;
            }
        }

        .porfile-picture-edit-icon-parent {
            position: absolute;
            width: 12.5vw;
            height: 12.5vw;
            background-color: $cyan-process;
            border-radius: 100%;
            top: 7%;
            right: 7%;

            img {
                max-width: 70%;
            }
        }
    }

    .input-parent {
        margin-top: 1rem;
        width: 100%;
        flex: 0 0 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }

    .input-child {
        font-size: 200%;
        font-weight: bolder;
        margin-left: 1rem;
        margin-right: 0.5rem;
        flex: 1
    }

    .edit-icon {
        max-width: 1.5rem;
        margin-left: 0.5rem;
        margin-right: 1rem;
        flex: 0 0 1;
    }

}
</style>