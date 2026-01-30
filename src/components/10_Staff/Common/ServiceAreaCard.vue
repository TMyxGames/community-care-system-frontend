<template>
    <card-layer class="service-area-card">
        <label>当前服务区域：</label>

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

        },
    }
</script>

<style>
    .service-area-card {
        height: 100%;
        width: 100%;
    }
</style>