<template>
    <div class="message-detail"> 
        <div v-for="msg in messageList"
            :key="msg.id"
            class="message-wrapper"
        >
            <component
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
    import axios from 'axios';
    import SystemMsgItem from './Common/SystemMsgItem.vue';
    import BindRequestItem from './Common/BindRequestItem.vue';
    import SecurityMsgItem from './Common/SecurityMsgItem.vue';

    const route = useRoute();
    const messageList = ref([]);

    const props = defineProps(['type']);

    const currentComponent = computed(() => {
        if (props.type === '0') return SystemMsgItem;
        if (props.type === '1') return BindRequestItem;
        if (props.type === '2') return SecurityMsgItem;
        return null;
    });
    const getMessageList = async () => {
        const res = await axios.get(`/message/all/${route.params.type}`);
        messageList.value = await res.data.data;
    };

    watch(() => route.params.type, () => {
        getMessageList();
    });

    onMounted(getMessageList);

</script>

<style scoped>
    .message-detail {
        width: 100%;
        height: 100%;
    }
</style>