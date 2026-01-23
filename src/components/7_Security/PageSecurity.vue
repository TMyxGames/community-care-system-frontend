<template>
    <glass-layer class="security-container">
        <div class="security-title">
            <div class="security-title-text">安全中心</div>
        </div>
    </glass-layer>
</template>

<script> 
    import GlassLayer from '../Common/GlassLayer.vue';
    import { useAuthStore } from '@/stores/auth';
    import { useHealthStore } from '@/stores/health';

    export default {
        name: 'PageSecurity',
        components: {
            GlassLayer,
        },
        setup() {
            const authStore = useAuthStore();
            const healthStore = useHealthStore();
            return { authStore, healthStore };

        },
        data() {
            return {

            }
        },
        mounted() {

        },
        methods: {

        }
    }
</script>

<style>

    .security-container {
        width: 100%;
        height: 150rem;

        max-width: 100rem;
    }
</style>