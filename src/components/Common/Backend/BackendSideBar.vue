<template>
    <div class="sidebar-container">
        <!-- logo区域 -->
        <div class="logo-area" @click="goToHome"> 
            <img id="logo" src="@/assets/房子.png" alt="logo">
            <div id="title">社区智慧养老服务系统</div>
        </div>

        <!-- 菜单区域 -->
        <div class="option-area"> 

            <router-link v-for="option in options" :key="option.id" :to="option.path">
                <div class="sidebar-option"> 
                    <span class="option-text">{{ option.name }}</span>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
    import { useRouter } from 'vue-router'

    export default {
        name: 'BackendSideBar',
        data() {
            return {
                options: [
                    {id:1, name: "用户管理", path: '/ManageUser'},
                    {id:2, name: "轮播图管理", path: '/ManageCarousel'},
                    {id:3, name: "服务管理", path: '/ManageService'},
                    {id:4, name: "内容列表管理", path: '/ManageContentList'},
                ]
            }
        },
        props: {
            value: String,
        },
        setup() {
            const router = useRouter()
            return { router }
        },
        methods: {
            goToHome() {
                this.router.push('/PageHome')
            },
        },
    }
</script>

<style scoped>
    .sidebar-container{
        width: 100%;
        height: 100%;
        /* padding: 10px; */

        background-color: #6191D3ce;
        backdrop-filter: blur(10px);

        /* z-index: 100; */
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .logo-area {
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

    .logo-area> #logo {
        width: 22px;
        height: 22px;
        /* color: #F8F6F6; */
    }

    .logo-area> #title {
        font-family: '晴雪体';
        font-size: 22px;
        color: #F8F6F6;
        user-select: none;
    }

    /* .option-area {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
    } */

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

    .option-text {
        font-family: 'HarmonyOS Sans SC';
        font-weight: 700;
        font-size: 20px;
        user-select: none;
        color: #F8F6F6;
        position: relative;
        white-space: nowrap;
        transition: all 0.3s ease;
    }
</style>