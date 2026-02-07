<template>
    <div class="my-binding-item">
        <!-- 信息区域 -->
        <div class="info-area">
            <!-- 用户信息 -->
            <div class="info-row">
                <img class="user-avatar" :src="$getFileUrl(item.avatarUrl) || defaultAvatar" alt="logo"/>
                <span class="user-username">@{{ item.username }}</span>
                <span class="user-real-name">{{ item.realName }}</span>
                <span class="user-id">( id:{{ item.id }} )</span>
            </div>
        </div>
        <!-- 操作区域 -->
        <div class="operation-area">
            <el-button
                class="operation-btn"
                type="danger"
                size="small"
                @click="confirmUnbind"
            >解除绑定</el-button>
        </div>
    </div>
</template>

<script setup>
    import defaultAvatar from '@/assets/兔兔.jpg';
    import { ElMessageBox, ElMessage } from 'element-plus';
    import request from '@/utils/request';

    const props = defineProps({
        item: {
            type: Object,
            required: true,
        },
    });

    const emit = defineEmits(['refresh']);

    // 确认解绑
    const confirmUnbind = () => { 
        ElMessageBox.confirm(
            `确定要解除与 @${props.item.username} 的绑定关系吗？此操作将通知对方。`,
            '解除绑定',
            {
                confirmButtonText: '确定解绑',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => { 
            executeUnbind();
        }).catch(() => {});
    };

    // 执行解绑
    const executeUnbind = async () => { 
        try { 
            const res = await request.post('/message/unbind', {
                targetId: props.item.id,
            });
            
            ElMessage.success('已解除绑定并通知对方');
            emit('refresh');
        } catch (error) { 
            console.error(error);
        }
    };


</script>

<style scoped>
    .my-binding-item {
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