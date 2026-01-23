<template>
    <div class="user-container logged"
        v-if="authStore.isLoggedIn"
    >
        <img class="user-logo" :src="$getFileUrl(userInfo.avatarUrl) || defaultAvatar" alt="logo" @click="goToMyPage"/>
        <button class="user-option" @click="handleLogout">注销</button>
    </div>
    <div class="user-container not-logged"
        v-else
    >
        <button class="user-option" @click="goToLogin">登录</button>
        <button class="user-option" @click="goToRegister">注册</button>
    </div>
</template>

<script>
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/stores/auth';
    import defaultAvatar from '@/assets/兔兔.jpg'


    export default {
        name: 'GlobalHeaderUser',
        props: {
            name: String
        },
        data() {
            return {
                defaultAvatar: defaultAvatar,
            }
        },
        setup() {
            const router = useRouter()
            const authStore = useAuthStore()
            return { router, authStore }
        },
        computed: {
            userInfo() {
                return this.authStore.userInfo || {};
            }
        },
        methods: {
            goToLogin() {
                this.router.push('/PageLogin')
            },
            goToRegister() {
                this.router.push('/PageRegister')
            },
            goToMyPage() {
                this.router.push('/PageMy')
            },
            handleLogout() {
                this.authStore.logout();
                this.router.push('/PageHome')
            },
        },
        components: {
        }
    }
</script>

<style scoped>
    .user-container {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .user-logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255);

    }

    /* 常态样式 */
    .user-option {
        height: 50px;
        border: 0px;
        background-color: rgba(255, 255, 255, 0%);
        border-radius: 37.5px;

        font-family: 'HarmonyOS Sans SC';
        font-size: 18px;
        font-weight: bold;
        color: #F8F6F6;
    }

    /* 焦点样式 */
    .user-option:hover {
        border: 0px;
        background-color: rgba(255, 255, 255, 0%);
        border-radius: 37.5px;

        font-family: 'HarmonyOS Sans SC';
        font-size: 18px;
        font-weight: bold;
        color: rgb(232, 150, 255);
    }
</style>