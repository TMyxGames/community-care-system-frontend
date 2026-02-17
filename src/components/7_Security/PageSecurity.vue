<template>
    <div class="head">
        <base-title>安全监控</base-title>
    </div>
    <glass-layer class="security-container">
        <div class="main-area">
            <!-- 地图 -->
            <div class="map-area">
                <map-container
                    class="map" ref="mapRef"
                />
            </div>
            
            <div class="side-area" v-if="authStore.activeRole !== 3">
                <card-layer class="choose-bar">

                </card-layer>

                <safe-area-item
                    v-for="area in areaStore.areaList"
                    :key="area.id"
                    :areaInfo="area"
                    @click="focusOnArea(area)"
                    @delete="confirmDelete"
                />

                <!-- 地图控制区域 -->
                <div class="map-control-area">
                    <el-button
                        type="primary"
                        @click="startDrawing"
                        :disabled="isDrawing"
                    >
                        开始绘制区域
                    </el-button>
                    <el-button
                        type="primary"
                        @click="handleSave"
                        :disabled="!isDrawing"
                    >
                        保存区域
                    </el-button>
                    <el-button
                        type="danger" 
                        @click="clearDrawing"
                        :disabled="!isDrawing"
                    >
                        重置
                    </el-button>
                    <el-button
                        type="danger"
                        plain
                        @click="cancelDrawing"
                        :disabled="!isDrawing"
                    >
                        取消绘制
                    </el-button>
                </div>
            </div>

        </div>
        
        <!-- 绘制完成后显示保存对话框 -->
        <el-dialog title="保存安全区域" v-model="dialogVisible">
            <el-form :model="areaForm">
                <el-form-item label="区域名称" label-width="80px">
                    <el-input v-model="areaForm.name" placeholder="请输入区域名称"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveArea">确定保存</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 模拟定位控制区域 -->
        <location-control :userId="34" type="user"/>

    </glass-layer>
</template>

<script> 
    import { useAuthStore } from '@/stores/auth';
    import { useAreaStore } from '@/stores/area';
    import { useHealthStore } from '@/stores/health';
    import { useLocationStore } from '@/stores/location';
    import { ElMessageBox } from 'element-plus';
    import GlassLayer from '../Common/GlassLayer.vue';
    import CardLayer from '../Common/CardLayer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import MapContainer from '../Common/MapContainer.vue';
    import SafeAreaItem from './Common/SafeAreaItem.vue';
    import LocationControl from '../Common/LocationControl.vue';


    export default {
        name: 'PageSecurity',
        components: {
            GlassLayer,
            CardLayer,
            BaseTitle,
            MapContainer,
            SafeAreaItem,
            LocationControl,
        },
        setup() {
            const authStore = useAuthStore();
            const areaStore = useAreaStore();
            const healthStore = useHealthStore();
            const locationStore = useLocationStore();

            return { authStore, areaStore, healthStore, locationStore };

        },
        data() {
            return {
                isDrawing: false,
                dialogVisible: false,
                areaForm: {
                    name: "",
                    path: null,
                },
            }
        },
        async mounted() {
            this.loadAllAreas();
            this.locationStore.loadMonitoringData();
            // this.$nextTick(() => {
            //     if (this.$refs.mapRef) {
            //         this.$refs.mapRef.fitView();
            //     }
            // });
        },
        methods: {

            // 显示所有区域
            async loadAllAreas() { 
                try {
                    const data = await this.areaStore.getAllSafeAreas();
                    if (this.$refs.mapRef && data) {
                        this.$refs.mapRef.existingAreaDisplay(data);
                    }
                } catch (error) {
                    this.$message.error("加载失败");
                }
            },
            // 聚焦区域
            focusOnArea(area) { 
                if (this.$refs.mapRef) {
                    this.$refs.mapRef.focusOnArea(area.id);
                    this.$message.success(`已定位至: ${area.areaName}`);
                }
            },
            // 删除前确认
            confirmDelete(id) { 
                ElMessageBox.confirm(
                    "确定要删除该区域吗?",
                    "提示",
                    { 
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                ).then(() => {
                    this.deleteArea(id);
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },
            // 删除区域
            async deleteArea(id) { 
                const success = await this.areaStore.removeSafeArea(id);
                if (success) {
                    this.loadAllAreas(); // 重新加载
                    this.$message.success("删除成功");
                }
            },
            // 开始绘制
            startDrawing() {
                this.isDrawing = true;
                this.$refs.mapRef.drawPolygon();
                this.$message.info("请在地图上点击绘制多边形，双击即可结束绘制");
            },
            // 重置
            clearDrawing() {
                if (this.$refs.mapRef) {
                    this.$refs.mapRef.clearDraw(); // 清除当前绘制
                    this.areaForm.path = null; // 清除路径
                    this.$refs.mapRef.drawPolygon();
                    this.$message.success("已重置");
                }
            },
            // 取消绘制
            cancelDrawing() {
                if (this.$refs.mapRef) {
                    this.$refs.mapRef.closeTool();
                    this.isDrawing = false;
                    this.$message.success("已取消绘制");
                }
            },
            // 获取路径
            handleSave() {
                const path = this.$refs.mapRef.getPath();
                if (path && path.length > 2) {
                    this.areaForm.path = path.map(p => [p.lng, p.lat]);
                    this.areaForm.centerLng = path[0].lng; // 获取中心点
                    this.areaForm.centerLat = path[0].lat; // 获取中心点
                    this.dialogVisible = true;
                } else {
                    this.$message.warning("请绘制有效区域，或双击结束绘制");
                }
            },
            // 保存绘制
            async saveArea() {
                if (!this.areaForm.name) return this.$message.warning("请填写名称");

                const payload = {
                    userId: this.authStore.userInfo.id,
                    areaName: this.areaForm.name,
                    scopePath: JSON.stringify(this.areaForm.path), // 将路径存储为JSON字符串
                    centerLng: this.areaForm.centerLng,
                    centerLat: this.areaForm.centerLat
                };
                try {
                    const res = await this.$http.post('/area/safe/add', payload);
                    this.$message.success("保存成功");
                    this.dialogVisible = false;
                    this.isDrawing = false;
                    this.loadAllAreas();
                    // 刷新列表
                } catch (error) {
                    this.$message.error("保存失败");
                }
            },

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
        gap: var(--thin-gap);
    }

    .head {
        height: auto;
        width: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
    }

    .main-area {
        width: 100%;
        height: auto;

        display: flex;
        gap: var(--thin-gap);
    }

    .map-area {
        width: 60rem;
        height: auto;

        display: flex;
    }

    .map {
        width: 100%;
        height: auto;
        max-width: 60rem;
        min-width: 20rem;

        aspect-ratio: 1 / 1;
    }

    .side-area { 
        width: auto;
        height: auto;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);
    }
</style>