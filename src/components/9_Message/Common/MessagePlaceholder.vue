<template>
    <div class="message-placeholder">
        <span class="tip">请选择你要查看的消息</span>
    </div>
</template>

<script> 
    export default {
        name: "MessagePlaceholder",
    }
</script>

<style scoped>
    .message-placeholder {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tip {
        font-size: 1.5rem;
    }
</style>