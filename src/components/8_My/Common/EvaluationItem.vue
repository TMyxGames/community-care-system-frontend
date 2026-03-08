<template>
    <div class="order-item-container">
        <div class="info-header">
            <img :src="$getFileUrl(evaluationInfo.avatarUrl)" class="avatar" alt="头像">
            <span class="username">{{ evaluationInfo.username }}</span>
            <span class="create-time">{{ formatTime(evaluationInfo.createTime) }}</span>
        </div>
        <div class="info-content">
            <div class="info-detail">
                <div class="title">{{ evaluationInfo.content }}</div>
            </div>
        </div>
    </div>
</template>

<script> 
    export default {
        name: 'EvaluationItem',
        props: {
            evaluationInfo: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
            }
        },
        methods: {
            formatTime(timeStr) {
                if(!timeStr) return '';
                return timeStr.replace('T', ' ').substring(0, 16);
            },

        },
    }
</script>

<style scoped>
    .order-item-container {
        width: 100%;
        height: 10rem;
        padding: var(--thin-gap);
        /* box-sizing: border-box; */

        background-color: #cadefc;
        border-radius: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);

    }

    .avatar {
        width: 5rem;
        height: 5rem;
        object-fit: cover;
        border-radius: 50%;
    }

    .username {
        font-size: 2rem;
    }

    .info-header {
        display: flex;
        align-items: center;
        gap: var(--thin-gap);
    }

    .info-content {
        display: flex;
        align-items: center;
        gap: var(--thin-gap);
    }

    .info-detail {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .action {
        display: flex;
        align-items: center;

        margin-left: auto;
    }
</style>