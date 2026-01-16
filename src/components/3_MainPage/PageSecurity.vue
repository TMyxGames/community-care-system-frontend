<template>
    <div class="security-container">
        <div class="security-title">
            <div class="security-title-text">安全中心</div>
        </div>
    </div>
</template>

<script> 
    import { useAuthStore } from '@/stores/auth';
    import { useHealthStore } from '@/stores/health';

    export default {
        name: 'PageSecurity',
        components: {
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
        /* padding: clamp(0.25rem, 1.5vw, 1.5rem); */
        padding: clamp(1rem, 2vw, 2rem);
        margin-top: 7rem;
        box-sizing: border-box;

        background-color: rgba(255, 255, 255, 50%);
        backdrop-filter: blur(10px);
        /* box-shadow: 0 0 2rem rgba(0, 0, 0, 10%); */
        border-radius: 2rem;

    }
</style>