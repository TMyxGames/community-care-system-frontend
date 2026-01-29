<template>
    <div class="head">
        <base-title>管理服务范围</base-title>
    </div>
    <glass-layer class="service-area-container">
        <!-- 地图 -->
        <map-container
            class="map" ref="mapRef"
        />
        <!-- <div v-else>未显示地图</div> -->

        <!-- 地图控制区域 -->
        <div class="map-control-area">
            <!-- <el-button
                type="primary"
                @click="handleMapDisplay"
            >
                显示地图
            </el-button> -->

            <el-button
                type="primary"
                @click="startDrawing"
                :disabled="isDrawing"
            >
                开始绘制区域
            </el-button>
            <el-button
                type="primary"
                @click="handleFinish"
                :disabled="!isDrawing"
            >
                绘制完成
            </el-button>
            <el-button
                type="danger" 
                @click="clearDrawing"
            >
                重置
            </el-button>
        </div>

        <!-- 绘制完成后显示保存对话框 -->
        <el-dialog title="保存服务区域">

        </el-dialog>
        

        <div class="area-list">

        </div>
    </glass-layer>
</template>

<script> 
    import { useAuthStore } from '@/stores/auth';
    import GlassLayer from '../Common/GlassLayer.vue';
    import CardLayer from '../Common/CardLayer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import MapContainer from '../Common/MapContainer.vue';

    export default {
        name: 'PageServiceArea',
        components: {
            GlassLayer,
            CardLayer,
            BaseTitle,
            MapContainer,
        },
        setup() {
            const authStore = useAuthStore();
            return { authStore };
        },
        data() {
            return {
                mapDisplay: false,
                isDrawing: false,
                dialogVisible: false,
                areaForm: {
                    name: "",
                    path: null,
                },
            }
        },
        methods: {
            handleMapDisplay() {
                this.mapDisplay = !this.mapDisplay;
            },
            startDrawing() {
                this.isDrawing = true;
                this.$refs.mapRef.drawPolygon();
                this.$message.info("请在地图上点击绘制多边形，完成后点击完成按钮");
            },
            handleFinish() {
                const path = this.$refs.mapRef.finishDrawing();
                if (path && path.length > 2) {
                    this.areaForm.path = path.map(p => [p.lng, p.lat]);
                    this.dialogVisible = true;
                } else {
                    this.$message.warning("请至少绘制三个点");
                }
            },
            clearDrawing() {
                this.$refs.mapRef.clearDrawing();
                this.currentPath = [];
                this.$message.success("清除成功");
            },
            async saveArea() {
                if (!this.areaForm.name) return this.$message.warning("请填写名称");

                const payload = {
                    userId: this.authStore.userInfo.id,
                    areaName: this.areaForm.name,
                    scopePath: JSON.stringify(this.areaForm.path), // 将路径存储为JSON字符串
                }

                try {
                    const res = await this.$http.post('/add', payload);
                    this.$message.success("保存成功");
                    this.dialogVisible = false;
                    this.isDrawing = false;
                    this.areaForm.name="";
                    // 刷新列表
                } catch (error) {
                    this.$message.error("保存失败");
                }
            },

        },
    }
</script>

<style scoped>
    .head {
        height: 100%;
        width: 100%;
        max-width: 100rem;
        padding: var(--thin-gap);
        box-sizing: border-box;

        display: flex;
        align-items: flex-end;
    }

    .service-area-container {
        height: 100rem;
        width: 100%;
        max-width: 100rem;

        display: flex;
        flex-direction: column;
        gap: var(--normal-gap);
    }

    .map {
        width: 100%;
        height: auto;

        aspect-ratio: 16 / 9;
    }

    .map-control-area {
        width: 100%;
        display: flex;
        align-items: center;
    }
</style>