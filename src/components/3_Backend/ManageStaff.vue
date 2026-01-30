<template>
    <div class="head">
        <base-title>服务人员管理</base-title>
    </div>
    <div class="staff-container">
        <div class="map-area">
            <!-- 地图 -->
            <map-container
                class="map" ref="mapRef"
            />
            
        </div>

        <div class="staff-area">
            <el-input placeholder="搜索服务人员">

            </el-input>
        </div>
    </div>
</template>

<script> 
    import { useAuthStore } from '@/stores/auth';
    import { useAreaStore } from '@/stores/area';
    import MapContainer from '@/components/Common/MapContainer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';

    export default {
        name: "ManageStaff",
        components: {
            MapContainer,
            BaseTitle,
        },
        setup() {
            const authStore = useAuthStore();
            const areaStore = useAreaStore();
            return { authStore, areaStore };
        },
        data() {
            return {
                map: null,
                currentPloygon: null,
            }
        },
        mounted() {
            this.loadAllAreas();
        },
        methods: {
            // 显示所有区域
            async loadAllAreas() { 
                try {
                    const data = await this.areaStore.getAllAreas();
                    if (this.$refs.mapRef && data) {
                        this.$refs.mapRef.clearAll();
                        this.$refs.mapRef.existingAreaDisplay(data);
                    }
                } catch (error) {
                    this.$message.error("加载失败");
                }
            },
        }
    }
</script>

<style scoped>
    .head {
        height: auto;
        width: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
    }

    .staff-container {
        height: 100%;
        width: 100%;

        display: flex;
        gap: var(--thin-gap);
    }

    .map-area {
        width: 60rem;
        height: auto;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);
    }

    .map {
        width: 100%;
        height: auto;
        max-width: 60rem;
        min-width: 20rem;

        aspect-ratio: 1 / 1;
    }

    .area-list {
        width: auto;
        height: 100%;
        min-width: 20rem;
        overflow-y: auto;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);

    }
</style>