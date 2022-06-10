<template>
  <div class="content">
    <div class="site-content">
      <!-- Push Message Alert Box -->
      <div class="alert flex">
        <v-scale-transition mode="out" hide-on-leave="true" origin="top center 0">
          <v-alert v-if="showNotification" border="start" density="comfortable" prominent :type="info">
            {{ notificationText }}
          </v-alert>
        </v-scale-transition>
      </div>
      <!-- Error Alert Box -->
      <div class="alert flex">
        <v-scale-transition mode="out" hide-on-leave="true" origin="top center 0">
          <v-alert v-if="showAlert" border="start" density="default" prominent :type="alertType">
            {{ alertText }}
          </v-alert>
        </v-scale-transition>
      </div>
      <!-- The Views -->
      <v-scroll-x-transition mode="in" hide-on-leave="true">
        <router-view @setUsername="setUsername" @triggerAlert="triggerAlert" @connectToUserSocket="connectToUserSocket"
          v-bind:socket="socket" />
      </v-scroll-x-transition>
    </div>
  </div>
</template>

<script>
import SocketioService from '@/services/socketio.service.ts';

export default {
  name: "App",
  data: function () {
    return {
      username: "",
      logInState: true,
      showAlert: false,
      alertType: "",
      alertText: "",
      showNotification: false,
      notificationText: "",
      socket: null,
    };

  },
  methods: {
    setUsername(username) {
      console.log(`Login successfull for ${username}`);
      this.username = username;
      this.logInState = true;
    },
    connectToUserSocket(user) {
      /**
       * Setup the connection for a user so we can recieve messages when a 
       * user is not a certain room. This will only be triggered if the
       * connection is not yet made
       */
      if (this.socket === null) {
        console.log(`connection für user ${user}`)
        this.socket = SocketioService.setupSocketConnection(user);
      }

      // Register the listener to events from the socket
      this.socket.on('notify new message', (data) => {
        // only send a notification if a user ist not actively participating in the chat
        if (this.$route.params.room !== data.room) {
          this.triggerNotification(data);
        }
      });

    },
    /**
     * Triggers a Notification for a incomming message
     * @param {Array} data 
     */
    triggerNotification(data) {
      this.notificationText = `${data.sender_username}: ${data.message}`;
      this.showNotification = true;
      setTimeout(() => {
        this.notificationText = "";
        this.showNotification = false;
      }, 5000);
    },

    /**
     * Triggers an alert once a error message should be deployed to a user
     * its usually triggered from children / grandchildren
     * @param {Array} data 
     */
    triggerAlert(data) {
      console.log(data);
      this.alertType = data.status;
      this.alertText = data.message;
      this.showAlert = true;
      setTimeout(() => {
        this.alertType = "";
        this.alertText = "";
        this.showAlert = false;
      }, 5000);
    },
  },
  created() {
    /**
     * If the side is reloaded but the user is still logged in, we
     * connect him to the socket again
     */
    if (localStorage.getItem('uuid')) {
      this.connectToUserSocket(localStorage.getItem('uuid'))
    }
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>
<style lang="scss">
@import "@/assets/variables.scss";
@import "@/assets/main.scss";

body,
html {
  background: $rich-black-fogra-39;
  color: $cyan-process;
  height: 100%;
  width: 100%;
}

body {
  display: flex;
  justify-content: stretch;
  align-items: stretch;
}

#app {
  width: inherit;
  height: inherit;
  margin: 0;
  padding: 0;
}

.content {
  display: flex;
  flex-flow: column;
  height: 100%;

  .header-content {
    flex: 0 1 $navBar-height;
  }

  .site-content {
    flex: 1 1 auto;
  }
}



.alert {
  position: fixed;
  top: 0;
  z-index: 9999;
  width: 100vw;
}
</style>

