<template>
    <div class="call-item">
        <!-- 头像区域 -->
        <div class="avatar-area">
            <img class="user-avatar" :src="$getFileUrl(callInfo.avatarUrl) || defaultAvatar" alt="logo"/>
        </div>
        <!-- 用户信息 -->
        <div class="info-area">
            <div class="user-info">
                <span class="user-username">@{{ callInfo.username }}</span>
                <span class="user-real-name">{{ callInfo.realName }}</span>
            </div>
            <span class="call-time">{{ formatTime(callInfo.callTime) }}</span>
        </div>
    </div>
</template>

<script setup>
    import defaultAvatar from '@/assets/兔兔.jpg';
    import { ElMessageBox, ElMessage } from 'element-plus';
    import request from '@/utils/request';

    const props = defineProps({
        callInfo: {
            type: Object,
            required: true,
        },
    });

    // 格式化日期
    const formatTime = (time) => {
        if (!time) return '';
        return time.replace('T', ' ').substring(0, 16);
    };

</script>

<style scoped>
    .call-item {
        width: auto;
        height: auto;
        /* max-width: 15rem; */
        padding: 1rem;

        background-color: #cadefc;
        border-radius: 1rem;

        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .info-area {
        width: auto;
        max-width: 15rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .user-avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .user-username {
        font-weight: 700;
        font-size: 1rem;
    }

    .user-real-name {
        font-weight: 500;
        font-size: 0.8rem;
    }

    .call-time {
        margin-left: auto;
    }
</style>