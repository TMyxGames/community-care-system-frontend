<template>
    <div class="healthData-container">
        <glass-layer class="choose_bar thin">
            <div class="option">
                <img class="avatar" 
                    :src="$getFileUrl(userInfo.avatarUrl) || defaultAvatar " 
                    alt="用户头像"
                    @click="handleUserChange(authStore.userInfo?.id)"
                />
                <label class="name">{{ authStore.userInfo.username }}</label>
            </div>

            <div class="option" 
                v-for="option in healthStore.boundList"
                :key="option.id"
            >
                <img class="avatar" 
                    :src="$getFileUrl(option.avatarUrl) || defaultAvatar " 
                    alt="用户头像"
                    
                    @click="handleUserChange(option.id)"
                />
                <label class="name">{{ option.username }}</label>
            </div>
            <button class="add_option" @click="goToBind">

            </button>
        </glass-layer>

        <HealthDataLayout></HealthDataLayout>
    </div>

</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';
    import MidOverlay from '../Common/MidOverlay.vue';
    import GlassLayer from '../Common/GlassLayer.vue';
    import HealthDataLayout from './Common/HealthDataLayout.vue';
    import defaultAvatar from '@/assets/兔兔.jpg';

    export default {
        name: 'PageHealthData',
        components: {
            HealthDataLayout,
            GlassLayer,
            MidOverlay,
        },
        setup() {
            const router = useRouter();
            const healthStore = useHealthStore();
            const authStore = useAuthStore();
            return { router, healthStore, authStore };
        },
        data() {
            return {
                defaultAvatar: defaultAvatar,
            }
        },
        computed: {
            currentElderName() {
                const current = this.healthStore.boundList.find(e => e.id === this.healthStore.currentSelection);
                return current ? (current.remark || current.username) : '未选择';
            },
            userInfo() {
                return this.authStore.userInfo || {};
            },
        },
        created() {
            // 将当前登录用户的id赋值给myId
            // 如果myId存在，则获取该用户的绑定列表，并设置给boundList
            const myId = this.authStore.userInfo?.id;
            if (myId) {
                this.healthStore.getBoundList(myId);
            }
        },
        beforeUnmount() {
            // this.healthStore.$reset();
        },
        methods: {
            // 切换用户
            handleUserChange(val) {
                this.healthStore.setUserId(val);
            },
            // 跳转绑定页面
            goToBind() {
                this.$router.push('/Bind');
            },
        },
    }
</script>

<style scoped>
    .healthData-container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2.5rem;
    }

    .choose_bar {
        width: 100%;
        height: auto;
        max-width: 100rem;

        font-size: 28px;
        font-weight: bold;
        color: #132843;

        display: flex;
        gap: 1rem;
    }

    .option {
        width: auto;
        height: auto;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .name {
        font-size: 1rem;
    }

    .avatar {
        width: 5rem;
        height: 5rem;
        box-sizing: border-box;

        border-radius: 50%;
        border: 0.25rem solid rgba(255, 255, 255);

        /* cursor: pointer; */
        user-select: none;
    }

    .add_option {
        width: 5rem;
        height: 5rem;
        box-sizing: border-box;

        border-radius: 50%;
        border: 0.25rem solid rgba(255, 255, 255);

        /* cursor: pointer; */
        user-select: none;
    }

</style>