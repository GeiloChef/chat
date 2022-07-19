<template>
    <div class="desktopInformation">
        <div class="title">
            This site does not support desktop usage.
            <br /> <br />
            Please switch to a mobile device or use the dev tools of your
            browser.
        </div>
    </div>
</template>

<script>
export default {
    name: "DesktopInformation"
}
</script>

<style lang="scss">
.desktopInformation {
    width: 100vw;
    height: 100vh;
    background-color: black;
    color: white;
    padding: 5vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    font-size: 300%;
    text-align: center;
}
</style>