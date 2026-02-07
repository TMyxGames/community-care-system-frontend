<template>
    <card-layer class="sidebar-container">
        <router-link
            v-for="session in messageStore.sessionList"
            :key="session.id"
            :to="`/PageMessage/${session.id}?type=${session.type}`"
            custom
            v-slot="{ isActive, navigate }"
        >
            <div 
                :class="['sidebar-option', { 'is-active': isActive }]"
                @click="handleNavigate(navigate)"
            > 
                <span class="option-text">{{ getSessionName(session) }}</span>
            </div>
        </router-link>
    </card-layer>
</template>

<script setup> 
    import { useRouter } from 'vue-router'
    import { useMessageStore } from '@/stores/message';
    import CardLayer from '@/components/Common/CardLayer.vue';
    import { onMounted } from 'vue';

    const messageStore = useMessageStore();

    // 获取会话名称
    const getSessionName = (session) => {
        if (session.name) return session.name;

        const typeMap = {
            0: '系统通知',
            1: '绑定请求',
            2: '安全提醒',
        };
        return typeMap[session.type] || '未知会话';
    }

    const handleNavigate = (navigate) => {
        navigate();
    }

    onMounted(() => {
        messageStore.getSessionList();
    })
</script>

<style scoped>
    .sidebar-container {
        width: 100%;
        height: 50rem;
        max-width: 20rem;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .sidebar-option {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;

        border-radius: 2rem;
        background-color: rgb(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
    }

    .is-active {
        background-color: #ecf5ff;
        color: #409eff;
        font-weight: bold;
    }

    .option-text {
        font-family: 'HarmonyOS Sans SC';
        font-weight: 700;
        font-size: 20px;
        user-select: none;
        color: #132843;
        position: relative;
        white-space: nowrap;
        transition: all 0.3s ease;
    }
</style>