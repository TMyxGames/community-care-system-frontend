<template>
    <div class="staff-item-container">
        <div class="info-area">
            <div class="info-row">
                <span class="staff-real-name">{{ staffInfo.realName }}</span>
                <span class="staff-username">@{{ staffInfo.username }}</span>
            </div>
            <div class="info-row">
                <span class="staff-area">所属区域：{{ staffInfo.areaName || "暂无"}}</span>

            </div>
            <div class="info-row">
                <span class="staff-status">当前状态：</span>
                <el-tag
                    :type="serviceStatusName[staffInfo.serviceStatus]?.type || 'info'"
                    size="small"
                    effect="plain"
                    class="work-tag"
                >{{ serviceStatusName[staffInfo.serviceStatus]?.text || '未知' }}</el-tag>
            </div>
            <div class="info-row">
                <span class="staff-work">负责服务：</span>
            </div>
            <div class="info-row">
                <el-tag
                    v-for="name in serviceNames"
                    :key="name"
                    size="small"
                    effect="plain"
                    class="work-tag"
                >{{ name }}</el-tag>
                <el-tag
                    v-if="serviceNames.length === 0"
                    size="small"
                    effect="plain"
                    class="work-tag"
                >暂无</el-tag>
            </div>
        </div>

        <div class="operation-area">
            <el-button
                class="operation-btn"
                type="text"
                size="small"
                @click.stop="$emit('operation', staffInfo)"
            >操作</el-button>
        </div>
    </div>
</template>

<script>
    import { useServiceStore } from '@/stores/service';

    export default {
        name: 'StaffItem',
        props: {
            staffInfo: {
                type: Object,
                required: true,
            }
        },
        setup() {
            const serviceStore = useServiceStore();
            return { serviceStore };
        },
        computed: {
            // 通过服务id获取服务名称
            serviceNames() {
                if (!this.staffInfo.serviceIds || this.staffInfo.serviceIds.length === 0) {
                    return [];
                }
                // 从 serviceStore 的缓存列表中查找匹配的名称
                return this.staffInfo.serviceIds.map(id => {
                    const service = this.serviceStore.serviceList.find(s => s.id === id);
                    return service ? service.title : '未知服务';
                });
            },
            // 通过状态参数获取状态名称
            serviceStatusName() {
                return {
                    0: {text:'离线', type:'info'},
                    1: {text:'空闲中', type:'success'},
                    2: {text:'活动中', type:'warning'},
                }
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

<style scoped>
    .staff-item-container {
        width: auto;
        height: auto;
        /* max-width: 15rem; */
        padding: 1rem;

        background-color: #cadefc;
        border-radius: 1rem;

        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .info-area {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.25rem;
    }

    .info-row {
        width: auto;
        max-width: 15rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .staff-real-name {
        font-weight: 700;
        font-size: 1rem;
    }

    .staff-username {
        font-weight: 500;
        font-size: 0.8rem;
    }

    .staff-area{
        font-weight: 500;
        font-size: 0.8rem;
    }

    .staff-status {
        font-weight: 500;
        font-size: 0.8rem;
    }

    .operation-area {
        margin-left: auto;
    }

    .work-tag {
        margin-right: 0.25rem;
    }


</style>