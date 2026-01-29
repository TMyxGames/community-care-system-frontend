<template>
    <card-layer class="staff-order-card thin">
        <el-tabs v-model="activeName" class="order-tabs">
            <el-tab-pane label="待接订单" name="first">
                待接订单
            </el-tab-pane>
            <el-tab-pane label="进行订单" name="second">
                进行订单
            </el-tab-pane>
        </el-tabs>
    </card-layer>

</template>

<script> 
    import CardLayer from '@/components/Common/CardLayer.vue';

    export default {
        name: "StaffOrderCard",
        components: {
            CardLayer,
        },
        data() {
            return {

            }
        },
        methods: {

        },
        mounted() {

        },
        created() {

        }
    }
</script>

<style scoped>
    .staff-order-card {
        width: 100%;
        height: 100%;
    }

    .order-tabs {
        width: 100%;
        height: auto;
    }

    @media (max-width: 768px) { 

    }
</style>