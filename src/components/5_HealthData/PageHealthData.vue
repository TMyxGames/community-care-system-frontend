<template>
    <div class="healthData-container">
        <div class="choose_bar"> 
            <img class="option" :src="$getFileUrl(userInfo.avatarUrl) || defaultAvatar " alt="用户头像"
                @click="handleUserChange(authStore.userInfo?.id)"
            />

            <img class="option" :src="$getFileUrl(option.avatarUrl) || defaultAvatar " alt="用户头像"
                v-for="option in healthStore.boundList"
                :key="option.id"
                @click="handleUserChange(option.id)"
            />
            
            <button class="add_option" @click="goToBind">

            </button>
        </div>
        <div>
            <HealthDataLayout></HealthDataLayout>
        </div>
    </div>

</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';
    import HealthDataLayout from './Common/HealthDataLayout.vue';
    import defaultAvatar from '@/assets/兔兔.jpg';

    export default {
        name: 'PageHealthData',
        components: {
            HealthDataLayout,
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
            //判断头像
            // avatarSrc() {
            //     if (this.userInfo && this.userInfo.avatarUrl) {
            //         return this.$getFileUrl(this.userInfo.avatarUrl);
            //     }
            //     return defaultAvatar;
            // }
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
        padding: clamp(0rem, 2rem);

        /* background-color: #f8f6f6; */
        
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: visible;
        gap: 2.5rem;

        /* background-color: rgba(255, 255, 255, 25%); */
    }

    .choose_bar {
        width: 100%;
        height: 5rem;
        max-width: 100rem;

        font-size: 28px;
        font-weight: bold;
        color: #132843;

        background-color: rgba(255, 255, 255, 50%);
        backdrop-filter: blur(10px);
        /* box-shadow: 0 0 2rem rgba(0, 0, 0, 10%); */
        border-radius: 1rem;
    }

    .option {
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