<template>
    <div>
        <v-alert border="start" density="default" prominent :type="alertType">
            {{ alertInfo.message }}
        </v-alert>
    </div>
</template>

<script>
export default {
    name: "AlertBox",
    data: function () {
        return {
            alertType: "",
            showAlert: false,
        };
    },
    props: {
        alertInfo: Object,
    },
    created() {
        console.log("Test" + this.alertInfo.id)
        this.alertType = this.alertInfo.status;
        this.showAlert = true;
        setTimeout(() => {
            this.showAlert = false;
            console.log(`Alert ${this.alertInfo.id}`)
        }, 5000);
    }
    
}
</script>