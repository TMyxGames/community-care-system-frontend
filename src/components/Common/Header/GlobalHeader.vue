<!-- 未来改动 -->
<template>
    <div class="header-container" :class="{ 'is-transparent': isHomePage && !isScrolled }">

        <div class="logo-area">
            <img id="logo" src="@/assets/房子.png" alt="logo">
            <div id="title">社区智慧养老服务系统</div>
        </div>

        <div class="left-area">
            <router-link 
            v-for="option in options"
            :key="option.id"
            :to="option.path"
            custom 
            v-slot="{ isActive, navigate }"
            >
                <GlobalHeaderOption 
                class="header-option"
                :name="option.name"
                :active="isActive"
                @click="navigate">
                </GlobalHeaderOption>
            </router-link>
        </div>

        <div class="right-area">
            <GlobalHeaderUser></GlobalHeaderUser>
        </div>
        
    </div>
</template>


<script>
    import GlobalHeaderOption from '../Header/GlobalHeaderOption.vue'
    import GlobalHeaderUser from '../Header/GlobalHeaderUser.vue'

    export default {
        name: 'GlobalHeader',
        components: {
            GlobalHeaderOption,
            GlobalHeaderUser,
        },
        props: {

        },
        data() {
            return {
                isScrolled: false,
                isHomePage: false,
                options: [
                    {id:1, name: "首页", path: '/PageHome'},
                    {id:2, name: "消息", path: '/PageMessage'},
                    {id:3, name: "健康档案", path: '/PageHealthData'},
                    {id:4, name: "安全监控", path: '/PageSecurity'},
                    {id:5, name: "社区服务", path: '/PageService'},
                    {id:5, name: "后台测试", path: '/ManageUser'},
                ]
            }
        },
        watch: {
            '$route': {
                handler: 'checkRoute',
                immediate: true,
            }
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll);
        },
        beforeUnmount() {
            window.removeEventListener('scroll', this.handleScroll);
        },
        methods: {
            handleScroll() {
                const scrollTop = window.scroolY || document.documentElement.scrollTop || document.body.scrollTop;
                this.isScrolled = window.scrollY > 500;
            },
            checkRoute() {
                this.isHomePage = this.$route.path === '/PageHome' || this.$route.path === '/';
                this.isScrolled = !this.isHomePage;
            },
        },
    }
</script>

<style scoped>
    .header-container {
        position: fixed;
        z-index: 100;
        top: 0;
        height: 4rem;
        width: 100vw;
        padding: 0.5rem;
        /* padding: 10px; */

        display: flex;
        align-items: center;

        box-sizing: border-box;
        /* background-color: #6191D3ce; */
        background-color: #40a0ffce;
        backdrop-filter: blur(5px);
        box-shadow: 0 0 25px rgba(0, 0, 0, 50%);
        transition: 
            background-color 0.5s ease,
            backgdrop-filter 0.5s ease,
            box-shadow 0.5s ease;
    }

    .header-container.is-transparent {
        background-color: transparent;
        /* background-color: #40a0ffce; */
        backdrop-filter: none;
        box-shadow: none;
    }

    .logo-area {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;

        padding: 5px 17px 5px 17px;
        background-color: rgb(255, 255, 255, 0.5);
        border-radius: 2rem;
        /* backdrop-filter: blur(10px); */
    }

    .logo-area> #logo {
        width: 25px;
        height: 25px;
        /* color: #F8F6F6; */
    }

    .logo-area> #title {
        font-family: '晴雪体';
        font-size: 24px;
        color: #F8F6F6;
        user-select: none;
    }

    .left-area {
        display: flex;
        align-items: center;
        margin-left: 50px;
        gap: 25px;
        flex-shrink: 0;
    }

    .right-area {
        display: flex;
        align-items: center;
        margin-left: auto;
        gap: 10px;
        flex-shrink: 0;
    }
</style>