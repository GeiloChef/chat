<template>
    <div class="settings-switch-parent flex">
        <div class="settings-switch-text">
            <div class="settings-switch-headline">
                {{ switchInfo.name }}
            </div>
            <div v-if="switchInfo.description" class="settings-switch-description">
                {{ switchInfo.description }}
            </div>
        </div>
        <v-switch color="primary" class="settings-switch settings-switch-off" value="red" hide-details>
        </v-switch>
    </div>
</template>

<script>
export default {
    name: 'SettingsSwitch',
    data: function () {
        return {

        }
    },
    props: {
        switchInfo: Object,
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.settings-switch-parent {
    width: 100%;
    flex-wrap: wrap;

    .settings-switch-text {
        padding-left: 10%;
        flex: 0 0 75%;

        .settings-switch-headline {
            font-size: 125%;
            font-weight: bolder;
        }

        .settings-switch-description {
            max-width: 80%;
        }
    }

    .settings-switch {
        padding: 0 2%;
        flex: 1;
    }

    .settings-switch-off .v-input--selection-controls__input div {
        color: $eerie-black !important;
    }
}
</style>