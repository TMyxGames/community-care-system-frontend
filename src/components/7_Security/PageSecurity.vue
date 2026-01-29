<template>
    <glass-layer class="security-container">
        <base-title>安全中心</base-title>
        <el-button
            type="primary"
            @click="handleMapDisplay"
        >
            显示地图
        </el-button>
        <map-container class="map" v-if="mapDisplay === true"></map-container>
        <div v-else>未显示地图</div>
    </glass-layer>
</template>

<script> 
    import { useAuthStore } from '@/stores/auth';
    import { useHealthStore } from '@/stores/health';
    import GlassLayer from '../Common/GlassLayer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import MapContainer from '../Common/MapContainer.vue';

    export default {
        name: 'PageSecurity',
        components: {
            GlassLayer,
            BaseTitle,
            MapContainer,
        },
        setup() {
            const authStore = useAuthStore();
            const healthStore = useHealthStore();
            return { authStore, healthStore };

        },
        data() {
            return {
                mapDisplay: false,
            }
        },
        mounted() {

        },
        methods: {
            handleMapDisplay() {
                this.mapDisplay = !this.mapDisplay;
            }
        }
    }
</script>

<style>
    .security-container {
        width: 100%;
        height: 150rem;

        max-width: 100rem;

        display: flex;
        flex-direction: column;
    }

    .map {
        width: 100%;
        height: auto;

        aspect-ratio: 16 / 9;
    }
</style>