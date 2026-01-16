<template>
    <GlobalBackground></GlobalBackground>
    <div id="login-overlay">
        <!-- 返回按钮需要完善效果 -->
        <router-link to="/PageHome">
            <button class="back">← 返回主页</button>
        </router-link>
        <!-- <button class="back" @click="goHome">← 返回主页</button>  -->

        <!-- logo区域 -->
        <div id="logo-area">
            <img id="logo" src="@/assets/房子.png" alt="logo">
            <div id="title">社区智慧养老服务系统</div>
        </div>

        <!-- 卡片区域 -->
        <div id="card-area">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import { useRouter } from 'vue-router';
    import GlobalBackground from '../Common/GlobalBackground.vue'

    export default {
        name: 'PageLogin',
        components: {
            GlobalBackground,
        },
        data() {
            return {
                inputValue: '',
            }
        },
        setup() {
            const router = useRouter();
            return { router };
        },
        methods: {
            goHome() {
                this.router.push('/PageHome')
            }
        }
    }
</script>

<style scoped>
    #login-overlay {
        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 25%);
        backdrop-filter: blur(10px);

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-family: "HarmonyOS Sans SC";
        text-align: center;
        color: #132843;
    }

    #logo-area {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;

        margin-bottom: 20px;
        padding: 5px 17px 5px 17px;
        /* background-color: rgb(255, 255, 255, 0.5); */
        border-radius: 2rem;
        /* backdrop-filter: blur(10px); */
    }

    #logo-area> #logo {
        width: 34px;
        height: 34px;
        /* color: #F8F6F6; */
    }

    #logo-area> #title {
        font-family: '晴雪体';
        font-size: 32px;
        color: rgba(255, 255, 255);
        user-select: none;
    }

    .back {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 150px;
        height: 50px;

        border: 0px;
        background-color: rgba(255, 255, 255, 75%);
        backdrop-filter: blur(10px);
        border-radius: 2rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 7.5%);

        font-weight: 500;
        font-size: 16px;

        /* display: flex; */
    }

</style>