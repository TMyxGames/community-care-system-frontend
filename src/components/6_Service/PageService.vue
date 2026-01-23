<template>
    <div class="service-container">

        <!-- 加载中时显示加载中 -->
        <template
            v-if="serviceStore.loading"
        >
            <!-- <h1>加载中...</h1> -->
        </template>

        <!-- 有服务时显示服务 -->
        <template
            v-else-if="isContent === true"
        >
            <ServiceLayout :dataList="serviceStore.services"></ServiceLayout>
        </template>

        <!-- 没有服务时显示暂无服务 -->
        <template
            v-else
        >
            <h1>暂无服务</h1>
        </template>

    </div>
</template>

<script>
    import ServiceLayout from './Common/ServiceLayout.vue';
    import { useServiceStore } from '@/stores/service';

    export default {
        name: 'PageService',
        components: {
            ServiceLayout,
        },
        setup() {
            const serviceStore = useServiceStore();
            return { serviceStore }
        },
        data() {
            return {
                isContent: true, // 是否有内容
            }
        },
        mounted() {
            this.serviceStore.getAllServices();
        },
        methods: {
            
        },
    }
</script>

<style scoped>
    .service-container {
        height: 100%;
        width: 100vw;
        /* padding: clamp(0rem, 2rem); */
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>