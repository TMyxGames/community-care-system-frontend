<template>
    <div class="layout">
        <el-container>
            <!-- 侧边区域 -->
            <el-aside class="sidebar">
                <BackendSideBar></BackendSideBar>
            </el-aside>
            <!-- 主体区域 -->
            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>

        </el-container>
    </div>
</template>

<script>
    import GlobalBackground from '../Common/GlobalBackground.vue';
    import MidOverlay from '../Common/MidOverlay.vue';
    import BackendSideBar from '../3_Backend/Common/BackendSideBar.vue';

    export default {
        components: {
            GlobalBackground,
            MidOverlay,
            BackendSideBar,
        },
        data: function() {
            return {
                // 侧边栏宽度
                sidebarWidth: '15rem',
                // 侧边栏高度
                sidebarHeight: '100vh',
                // 侧边栏背景
                sidebarBackground: '#6191D3ce',
                // 侧边栏阴影
            }
        }
    }

</script>

<style scoped>
    .layout {
        /* padding: 1rem; */
        background-color: transparent;

        /* overflow: hidden; */
    }

    .sidebar {
        height: 100vh;
        box-sizing: border-box;
    }

    .header {
        height: 5rem;
        background-color: #7a7a7ace;
        backdrop-filter: blur(10px);
    }

    .title {
        /* font-size: 20px; */
        color: #132843;
    }
</style>