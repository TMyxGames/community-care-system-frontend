<template>
    <div class="sidebar-container">
        <router-link v-for="option in options" :key="option.id" :to="option.path">
            <div class="sidebar-option"> 
                <span class="option-text">{{ option.name }}</span>
            </div>
        </router-link>
    </div>
</template>

<script> 
    import { useRouter } from 'vue-router'

    export default {
        name: 'MySideBar',
        props: {
            
        },
        data() {
            return {
                options: [
                    {id:1, name: "账户信息", path: '/MyInfo'},
                    {id:2, name: "订单管理", path: '/MyOrder'},
                    {id:3, name: "地址管理", path: '/MyAddress'},
                    {id:4, name: "绑定管理", path: '/MyBinding'},
                ]
            }
        },
        setup() {
            const router = useRouter()
            return { router }
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
        /* padding: clamp(0.25rem, 1.5vw, 1.5rem); */
        padding: clamp(1rem, 2vw, 2rem);
        box-sizing: border-box;

        /* background-color: rgba(255, 255, 255, 50%); */
        background-color: #fff;
        backdrop-filter: blur(10px);
        /* box-shadow: 0 0 2rem rgba(0, 0, 0, 10%); */
        border-radius: 1rem;

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