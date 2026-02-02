<!-- 未来更新 -->
<!-- 增加批量操作 -->

<template>
    <div class="head">
        <base-title>服务人员管理</base-title>
    </div>
    <div class="staff-container">
        <!-- 地图 -->
        <div class="map-area">
            <map-container
                class="map" ref="mapRef"
            />
        </div>
        <!-- 服务人员列表 -->
        <div class="staff-area">
            <el-input placeholder="搜索服务人员"/>
            <staff-item
                v-for="staff in userStore.allStaff"
                :key="staff.id"
                :staffInfo="staff"
                @operation="handleOp"
                @click="$refs.mapRef.focusOnStaff(staff)"
            />    
        </div>
        <!-- 操作对话框 -->
        <el-dialog title="调整服务人员配置" v-model="dialogVisible">
            <el-form :model="staffForm" label-width="80px">
                <el-form-item label="服务人员">
                    <el-tag type="info">{{ staffForm.username }} (ID: {{ staffForm.id }})</el-tag>
                </el-form-item>

                <el-form-item label="所属区域">
                    <el-select v-model="staffForm.area" placeholder="请选择服务区域" style="width: 100%">
                        <el-option label="暂不分配（空）" :value="null">
                            <span style="color: #909399; font-style: italic;">暂不分配（空）</span>
                        </el-option>
                        <el-option
                            placeholder="请选择服务区域"
                            v-for="item in areaStore.areaList"
                            :key="item.id"
                            :label="item.areaName"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="负责服务">
                    <el-select
                        v-model="staffForm.work"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        :max-collapse-tags="3"
                        placeholder="请选择服务项目"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="s in serviceStore.serviceList"
                            :key="s.id"
                            :label="s.title"
                            :value="s.id"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveStaff">确定保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script> 
    import { useUserStore } from '@/stores/user';
    import { useAreaStore } from '@/stores/area';
    import { useServiceStore } from '@/stores/service';
    import MapContainer from '@/components/Common/MapContainer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import StaffItem from './Common/StaffItem.vue';

    export default {
        name: "ManageStaff",
        components: {
            MapContainer,
            BaseTitle,
            StaffItem,
        },
        setup() {
            const userStore = useUserStore();
            const areaStore = useAreaStore();
            const serviceStore = useServiceStore();
            return { userStore, areaStore, serviceStore };
        },
        data() {
            return {
                dialogVisible: false,
                staffForm: {
                    id: "",
                    area: "",
                    work: "",
                },
            }
        },
        mounted() {
            this.loadAllAreas();
            this.userStore.getStaffList();
            this.serviceStore.getAllServices();
        },
        computed: {

        },
        methods: {
            // 显示所有区域
            async loadAllAreas() { 
                try {
                    const data = await this.areaStore.getAllServiceAreas();
                    if (this.$refs.mapRef && data) {
                        this.$refs.mapRef.clearAll();
                        this.$refs.mapRef.existingAreaDisplay(data);
                    }
                } catch (error) {
                    this.$message.error("加载失败");
                }
            },
            // 处理操作事件
            handleOp(staff) { 
                // staff承载从组件中抛出的staffInfo对象
                this.staffForm = {
                    id: staff.id, // 将对象的id赋值给form，然后显示在对话框中
                    username: staff.username, // 同上
                    area: staff.serviceAreaId || "",
                    work: staff.serviceIds || [],
                };
                this.dialogVisible = true;
            },
            // 保存服务人员改动
            async saveStaff() { 
                const payload = {
                    // 字段对应后端StaffConfigDto的字段
                    userId: this.staffForm.id, // 对应form中的字段
                    areaId: this.staffForm.area, // 同上
                    serviceIds: this.staffForm.work,
                }

                try {
                    const success = await this.userStore.updateStaffConfig(payload);
                    if (success) {
                        this.$message.success("保存成功");
                        this.dialogVisible = false;

                        await this.userStore.getStaffList();
                    } else {
                        this.$message.error("保存失败");
                    }
                } catch (error) {
                    console.error("保存失败:", error);
                    this.$message.error("保存失败");
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

    .staff-area {
        width: auto;
        height: auto;
        min-width: 20rem;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);
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