<template>
    <div class="order-item-container">
        <div class="info-header">
            <img :src="$getFileUrl(evaluationInfo.avatarUrl)" class="avatar" alt="头像">
            <div class="row">
                <span class="username">{{ evaluationInfo.username }}</span>
                <span class="create-time">{{ formatTime(evaluationInfo.createTime) }}</span>
            </div>
        </div>
        <div class="content">
            {{ evaluationInfo.content }}
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
                return timeStr.replace('T', ' ').substring(0, 10);
            },

        },
    }
</script>

<style scoped>
    .order-item-container {
        width: 100%;
        height: 10rem;
        padding: var(--thin-gap);
        box-sizing: border-box;

        background-color: #cadefc;
        border-radius: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);

    }

    .avatar {
        width: 3rem;
        height: 3rem;
        object-fit: cover;
        border-radius: 50%;
    }

    .username {
        font-size: 1.5rem;
    }

    .row {
        display: flex;
        flex-direction: column;

    }

    .info-header {
        display: flex;
        align-items: center;
        gap: var(--thin-gap);
    }

    .content {
        display: flex;
        gap: var(--thin-gap);
    }

</style>