<template>
    <div class="bind-request-item-container">
        <!-- 信息区域 -->
        <div class="info-area">
            <!-- 用户信息 -->
            <div class="info-row">
                <img class="user-avatar" :src="$getFileUrl(msg.otherUser.avatarUrl) || defaultAvatar" alt="logo"/>
                <span class="user-username" v-if="msg.otherUser">@{{ msg.otherUser.username }}</span>
                <span class="user-real-name">{{ msg.otherUser.realName }}</span>
                <span class="user-id">( id:{{ msg.otherUser.id }} )</span>
            </div>
            <!-- 提示文本 -->
            <div class="info-row">
                <!-- 待处理 -->
                <template v-if="msg.status === 0">
                    <p v-if="isSender">您向对方发送了绑定请求，等待对方处理...</p>
                    <p v-else>对方向您发送了绑定请求</p>
                </template>
                <!-- 同意 -->
                <template v-else-if="msg.status === 1">
                    <p v-if="isSender">对方已同意</p>
                    <p v-else>您已同意</p>
                </template>
                <!-- 拒绝 -->
                <template v-else-if="msg.status === 2">
                    <p v-if="isSender">对方已拒绝</p>
                    <p v-else>您已拒绝</p>
                </template>
                <!-- 解绑 -->
                <template v-else-if="msg.status === 3">
                    <p v-if="isSender">您已解除与@{{ msg.otherUser?.username }}的绑定</p>
                    <p v-else>@{{ msg.otherUser?.username }}已解除与您的绑定</p>
                </template>

            </div>
        </div>
        <!-- 操作区域 -->
        <div class="operation-area"
            v-if="msg.status === 0 && !isSender"
        >
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
        <div class="operation-area"
            v-if="msg.status !== 0 && msg.status !== 3"
        >   
            <el-tag :type="msg.status === 1 ? 'success' : 'danger'" effect="plain">
                {{ msg.status === 1 ? '已绑定' : '已拒绝' }}
            </el-tag>
        </div>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import request from '@/utils/request';
    import { ElMessage } from 'element-plus';
    import defaultAvatar from '@/assets/兔兔.jpg';

    const props = defineProps({
        // 后端传来的Message对象
        msg: {
            type: Object, 
            required: true
        },
    });

    const emit = defineEmits(['refresh']);
    const authStore = useAuthStore();
    const currentUserId = authStore.userInfo.id;

    // 判断当前用户是否是发送者
    const isSender = computed(() => props.msg.fromId === currentUserId);

    // const displayUser = computed(() => {
    //     return props.msg.otherUser;
    // });

    // const statusText = computed(() => {
    //     if (props.msg.status === 1) return '已同意';
    //     if (props.msg.status === 2) return '已拒绝';
    //     return '待处理';
    // });

    // const statusType = computed(() => {
    //     if (props.data.status === 1) return 'success';
    //     if (props.data.status === 2) return 'info';
    //     return 'warning';
    // });

    const handleAction = async (newStatus) => {
        try {
            const res = await request.put('/message/bind/handle', {
                messageId: props.msg.id,
                status: newStatus,
            });
            ElMessage.success(newStatus === 1 ? '已同意' : '已拒绝');
            emit('refresh');
        } catch (error) {
            console.log(error);
            ElMessage.error('处理失败');
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
        gap: 2.5rem;
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

    .user-avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
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