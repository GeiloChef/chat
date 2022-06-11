
export default {
    methods: {
        formatMessage(message) {
            // remove whitespaces
            message = message.trim();
            return JSON.stringify(message);
        }
    }
  }
