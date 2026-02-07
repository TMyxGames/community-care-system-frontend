<template>
    <div class="message-detail">
        <div class="mid-display-area">
            <!-- <el-empty v-if="messageStore.activeMessages.length === 0" description="暂无消息" /> -->
            <component
                
                v-for="msg in messageStore.activeMessages"
                :key="msg.id"
                :is="currentComponent"
                :msg="msg"
                @refresh="loadData"
            />
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useMessageStore } from '@/stores/message';
    import SystemMsgItem from './Common/SystemMsgItem.vue';
    import BindRequestItem from './Common/BindRequestItem.vue';
    import SecurityMsgItem from './Common/SecurityMsgItem.vue';

    const route = useRoute();
    const messageStore = useMessageStore();

    // 组件映射表
    const componentMap = {
        '0': SystemMsgItem,
        '1': BindRequestItem,
        '2': SecurityMsgItem,
    };

    // 根据路由参数计算当前组件
    const currentComponent = computed(() => {
        const type = route.query.type; // 从URL参数获取type
        return componentMap[type] || SystemMsgItem;
    });

    // 获取消息列表
    const loadData = () => { 
        const sessionId = route.params.id; // 从URL路径获取sessionId
        if (sessionId) {
            messageStore.getMessages(sessionId);
        }
    };

    watch(() => route.params.id, (newId) => {
        console.log('sessionId changed:', newId);
        if (newId) {
            loadData();
        }
    }, { immediate: true });

    onMounted(loadData);

</script>

<style scoped>
    .message-detail {
        width: 100%;
        height: 100%;
    }

    .mid-display-area {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        justify-content: flex-end;
        overflow-y: auto;

        gap: var(--thin-gap)
    }
</style>