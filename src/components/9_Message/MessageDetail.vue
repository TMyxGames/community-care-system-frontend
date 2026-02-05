<template>
    <div class="message-detail">
        <div class="mid-display-area">
            <component
                v-for="msg in messageList"
                :key="msg.id"
                :is="currentComponent"
                :data="msg"
                @refresh="getMessageList"
            />

        </div>
    </div>
</template>

<script setup>
    import { ref, watch, computed, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useMessageStore } from '@/stores/message';
    import axios from 'axios';
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
        const typeId = parseInt(route.params.type);
        return componentMap[typeId] || SystemMsgItem;
    });
    // 当前消息列表
    const messageList = computed(() => {
        const typeId = parseInt(route.params.type);
        return messageStore.messageList[typeId] || [];
    });
    // 获取消息列表
    const getMessages = async () => { 
        const typeId = parseInt(route.params.type);
        if (isNaN(typeId)) return;

        await messageStore.getMessageListByType(typeId);
    };

    watch(() => route.params.type, (newType) => {
        if (newType !== undefined) {
            getMessages();
        }
    }, { immediate: true });

    onMounted(() => { 
        getMessages();
    });

    // return { route, messageStore };





    // const route = useRoute();
    // const messageList = ref([]);

    // const props = defineProps(['type']);

    // const getMessageList = async () => {
    //     const res = await axios.get(`/message/all/${route.params.type}`);
    //     messageList.value = await res.data.data;
    // };

    // watch(() => route.params.type, () => {
    //     getMessageList();
    // });

    // onMounted(getMessageList);

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
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        overflow-y: auto;
    }
</style>