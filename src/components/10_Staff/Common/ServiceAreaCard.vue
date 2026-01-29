<template>
    <card-layer class="service-area-card">
        <label>当前正在使用</label>
        <el-button @click="toManageArea">管理服务范围</el-button>
    </card-layer>
</template>

<script>
    import CardLayer from '@/components/Common/CardLayer.vue';

    export default {
        name: "ServiceAreaCard",
        components: {
            CardLayer
        },
        props: {
            serviceArea: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {

            }
        },
        methods: {
            toManageArea() {
                this.$router.push('/PageServiceArea')
            }
        },
    }
</script>

<style>
    .service-area-card {
        height: 100%;
        width: 100%;
    }
</style>