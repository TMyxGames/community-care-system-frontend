<template>
    <glass-layer class="message-container">
        <div class="message-title">
            <div class="security-title-text">安全中心</div>
        </div>
    </glass-layer>

</template>

<script>
    import GlassLayer from '../Common/GlassLayer.vue';

    export default {
        name: "PageMessage",
        components: {
            GlassLayer,
        },
        data() {
            return {

            }
        },
        methods: {

        },
    }
</script>

<style scoped>
    .message-container {
        width: 100%;
        height: 150rem;

        max-width: 100rem;
    }
</style>