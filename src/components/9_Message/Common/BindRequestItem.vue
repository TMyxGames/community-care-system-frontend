<template>
    <div class="bind-request-item-container">
        <div class="info-area">
            <!-- 用户信息 -->
            <div class="info-row">
                <span class="user-username">@{{ displayUser.username }}</span>
                <span class="user-real-name">{{ displayUser.realName }}</span>
                <span class="user-id">( id:{{ displayUser.id }} )</span>
            </div>
            <!-- 提示文本 -->
            <div class="info-row">
                <p v-if="isSender">您向对方发送了绑定请求</p>
                <p v-else>对方向您发送了绑定请求</p>
            </div>
        </div>

        <div class="operation-area">
            <el-button
                class="operation-btn"
                type="success"
                size="small"
                @click="handleAction(1)"
            >同意</el-button>
            <el-button
                class="operation-btn"
                type="danger"
                size="small"
                @click="handleAction(2)"
            >拒绝</el-button>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import axios from 'axios';
    import { ElMessage } from 'element-plus';

    const props = defineProps({
        data: Object, // 后端传来的Message对象
    });

    const emit = defineEmits(['refresh']);
    const authStore = useAuthStore();
    const currentUserId = authStore.userInfo.id;

    // 判断当前用户是否是发送者
    const isSender = computed(() => props.data.fromId === currentUserId);

    const displayUser = computed(() => {
        return isSender.value ? props.data.toUser : props.data.fromUser;
    });

    const statusText = computed(() => {
        if (props.data.status === 1) return '已同意';
        if (props.data.status === 2) return '已拒绝';
        return '待处理';
    });

    const statusType = computed(() => {
        if (props.data.status === 1) return 'success';
        if (props.data.status === 2) return 'info';
        return 'warning';
    });

    const handleAction = async (newStatus) => {
        try {
            const res = await axios.put('/message/bind/handle', {
                id: props.data.id,
                status: newStatus,
            });
            if (res.data.code === 200) {
                ElMessage.success('操作成功');
                emit('refresh');
            }
        } catch (error) {
            ElMessage.error('操作失败');
        }
    };

</script>

<style scoped>
    .bind-request-item-container {
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.25rem;
    }

    .info-row {
        width: auto;
        max-width: 15rem;
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

    .operation-area {
        margin-left: auto;
    }

</style>