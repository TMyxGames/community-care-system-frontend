<template>
    <card-layer class="sidebar-container">
        <router-link
            v-for="option in options"
            :key="option.id"
            :to="option.path"
            custom
            v-slot="{ isActive, navigate }"
        >
            <div 
                :class="['sidebar-option', { 'is-active': isActive }]"
                @click="navigate"
            > 
                <span class="option-text">{{ option.name }}</span>
            </div>
        </router-link>
    </card-layer>
</template>

<script> 
    import { useRouter } from 'vue-router'
    import { useMessageStore } from '@/stores/message';
    import CardLayer from '@/components/Common/CardLayer.vue';

    export default {
        name: 'MySideBar',
        components: {
            CardLayer,
        },
        setup() {
            const router = useRouter();
            const messageStore = useMessageStore();
            return { router, messageStore };
        },
        data() {
            return {
                options: [
                    {id:1, name: "系统消息", path: '/PageMessage/0'},
                    {id:2, name: "绑定请求", path: '/PageMessage/1'},
                    {id:3, name: "安全提醒", path: '/PageMessage/2'},
                ]
            }
        },
        methods: {

        },
    }
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