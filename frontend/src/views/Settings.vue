<template>
    <div>
        <NavBar v-bind:origin_info="origin_info" />
        <SettingsProfile />
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import SettingsProfile from '@/components/SettingsProfile.vue';
export default {
    // eslint-disable-next-line
    name: "Settings",
    components: {
        NavBar,
        SettingsProfile
    },
    data: function () {
        let origin_info = {
            name: "settings",
        }
        return {
            origin_info,
        };
    },

}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.settings-card {
    width: 94%;
    margin: 0 3%;
    padding: 3% 0%;
    border: 1px solid $cyan-process;
    border-radius: 2rem;

    .settings-card-headline {
        text-align: center;
        font-size: 200%;
        width: 100%;
        font-weight: bolder;
        flex: 0 0 auto;
        margin-bottom: 1rem;
    }
}
</style>