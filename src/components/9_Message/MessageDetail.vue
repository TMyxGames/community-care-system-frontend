<template>
    <div class="message-detail">
        <div class="mid-display-area" ref="scrollContainer" @scroll="handleScroll">
            <div v-if="loading" class="loading-status">正在加载历史记录...</div>
            <div v-if="noMore" class="no-more">没有更多消息了</div>
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
    import { ref,nextTick, watch, computed, onMounted, onUnmounted } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useRoute } from 'vue-router';
    import { useMessageStore } from '@/stores/message';
    import { useAuthStore } from '@/stores/auth';
    import SystemMsgItem from './Common/SystemMsgItem.vue';
    import BindRequestItem from './Common/BindRequestItem.vue';
    import SecurityMsgItem from './Common/SecurityMsgItem.vue';

    const route = useRoute();
    const messageStore = useMessageStore();
    const authStore = useAuthStore();
    const { currentSessionId } = storeToRefs(messageStore);
    const scrollContainer = ref(null);

    // 消息容器组件映射表
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

    // 获取消息记录
    const loadData = async () => { 
        const sessionId = route.params.id; // 从URL路径获取sessionId
        if (sessionId) {
            messageStore.noMore = false;
            await messageStore.getMessages(sessionId);
            await nextTick();
            setTimeout(() => {
                scrollToBottom();
            }, 50);
        }
    };
    // 处理新消息
    const handleNewMessage = (event) => {
        const newMsg = event.detail;

        const index = messageStore.activeMessages.findIndex(m => m.id === newMsg.id);

        if (index !== -1) {
            const oldMsg = messageStore.activeMessages[index];
            messageStore.activeMessages[index] = {
                ...newMsg,
                otherUser: newMsg.otherUser || oldMsg.otherUser,
                isSelf: newMsg.fromId === authStore.userInfo.id
            };
            scrollToBottom();
        } else {
            if (newMsg.fromSessionId == currentSessionId.value || newMsg.toSessionId == currentSessionId.value) {
                messageStore.activeMessages.push({
                    ...newMsg,
                    isSelf: newMsg.fromId === authStore.userInfo.id
                });
                scrollToBottom();
            }
        }
    };

    // 滚动到底部
    const scrollToBottom = async () => {
        await nextTick();
        if (scrollContainer.value) {
            scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
        };
    };

    // 处理滚动事件
    const handleScroll = async () => {
        const el = scrollContainer.value;
        // 判断是否滚动到了顶部 (阈值 5px)
        if (el.scrollTop <= 5 && !messageStore.isLoading && !messageStore.noMore) {
            await getHistory();
        }
    };

    // 加载历史消息
    const getHistory = async () => {
        const el = scrollContainer.value;
        // 记录加载前的内容总高度
        const oldScrollHeight = el.scrollHeight;

        const newMessages = await messageStore.getHistory(route.params.id);

        if (newMessages.length > 0) {
            nextTick(() => {
                const newScrollHeight = el.scrollHeight;
                el.scrollTop = newScrollHeight - oldScrollHeight;
            });
        }
    };

    // 监听会话切换
    watch(() => route.params.id, (newId) => {
        console.log('sessionId changed:', newId);
        if (newId) {
            messageStore.currentSessionId = newId;
            loadData();
        }
    }, { immediate: true });

    // 监听消息列表的变化
    // watch(
    //     () => messageStore.activeMessages,
    //     () => {
    //         scrollToBottom();
    //     },
    //     { deep: true }
    // );

    onMounted(() => { 
        loadData();
        window.addEventListener('new-message', handleNewMessage);
    });

    onUnmounted(() => {
        window.removeEventListener('new-message', handleNewMessage);
    });

</script>

<style scoped>
    .message-detail {
        width: 100%;
        height: 60rem;
        overflow: hidden;
    }

    .mid-display-area {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;

        overflow-y: auto;
        overflow-anchor: none;
        /* padding: 5rem 0; */
        gap: var(--thin-gap);

        scroll-behavior: smooth;
    }

    .mid-display-area::before {
        content: "";
        flex: 1 1 auto; /* 自动填充剩余空间，把消息顶到底部 */
    }

</style>