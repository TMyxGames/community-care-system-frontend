<template>
    <div class="head">
        <base-title>服务区域管理</base-title>
    </div>
    <div class="service-area-container">
        <div class="map-area">
            <!-- 地图 -->
            <map-container
                class="map" ref="mapRef"
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
            <!-- 绘制完成后显示保存对话框 -->
            <el-dialog title="保存服务区域" v-model="dialogVisible">
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
        </div>

        <div class="area-list">
            <service-area-item
                v-for="area in areaStore.areaList"
                :key="area.id"
                :area-info="area"
                @click="focusOnArea(area)"
                @delete="confirmDelete"
            />
        </div>
    </div>
</template>

<script> 
    import { useAuthStore } from '@/stores/auth';
    import { useAreaStore } from '@/stores/area';
    import GlassLayer from '../Common/GlassLayer.vue';
    import CardLayer from '../Common/CardLayer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import MapContainer from '../Common/MapContainer.vue';
    import ServiceAreaItem from './Common/ServiceAreaItem.vue';
    import { ElMessageBox } from 'element-plus';

    export default {
        name: 'PageServiceArea',
        components: {
            GlassLayer,
            CardLayer,
            BaseTitle,
            MapContainer,
            ServiceAreaItem,
        },
        setup() {
            const authStore = useAuthStore();
            const areaStore = useAreaStore();
            return { authStore, areaStore };
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
                const success = await this.areaStore.removeArea(id);
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
                    adminId: this.authStore.userInfo.id,
                    areaName: this.areaForm.name,
                    scopePath: JSON.stringify(this.areaForm.path), // 将路径存储为JSON字符串
                    centerLng: this.areaForm.centerLng,
                    centerLat: this.areaForm.centerLat
                };
                try {
                    const res = await this.$http.post('/area/add', payload);
                    this.$message.success("保存成功");
                    this.dialogVisible = false;
                    this.isDrawing = false;
                    this.loadAllAreas();
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
        height: auto;
        width: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
    }

    .service-area-container {
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

    .map-control-area {
        width: 100%;
        display: flex;
        align-items: center;
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