<template>
    <div class="chatListParent">
        <div class="chatList-img">
            <img src="https://preview.redd.it/v0caqchbtn741.jpg?auto=webp&s=c5d05662a039c031f50032e22a7c77dfcf1bfddc" />
        </div>
        <span class="chatListName">{{ request.username }}</span>
        <button @click="$emit('handleRequest', {
            action: `accept`, 
            request: request
            })">
            Accept
        </button>
        <button @click="$emit('handleRequest', 
            {
                action: `decline`,
                request: request,
            }
            )">
            Decline
        </button>    </div>
</template>
<script>
export default {
    name: 'ChatRequestLink',
    props: {
        request: Object,
    }
}
</script>