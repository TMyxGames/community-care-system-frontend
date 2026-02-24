<template>
    <card-layer class="blood-sugar-card thin">
        <!-- 标题栏 -->
        <div class="title-row">
            <base-title class="title" color="#6eb6ff">血糖</base-title>
            <div class="button-area">
                <el-button
                    type="primary"
                    @click="openDialog('blood_sugar')"
                >添加数据</el-button>
                <el-radio-group v-model="timeControl">
                    <el-radio-button
                        label="latest"
                    >最新</el-radio-button>
                    <el-radio-button
                        label="7days"
                    >七天内</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <!-- 内容区 -->
        <div class="content-row">
            <div class="data-view" v-if="timeControl === 'latest'" key="latest">
                <card-cell 
                    label= "空腹血糖"
                    :value="summary.latestFastingBs?.bloodSugar"
                    unit="mmol"
                />
                <card-cell 
                    label= "餐后血糖"
                    :value="summary.latestPostprandialBs?.bloodSugar"
                    unit="mmol"
                />

            </div>
            <div class="data-view trend-view" v-else key="7days">
                <ChartSparkLine 
                    label="空腹血糖"
                    v-if="fastingDataset.length > 0"
                    :dataset="fastingDataset" 
                    color="#42b983" 
                />
                <div v-else class="no-data-small">暂无空腹记录</div>

                <ChartSparkLine
                    label="餐后血糖"
                    v-if="postprandialDataset.length > 0"
                    :dataset="postprandialDataset" 
                    color="#ffbb33" 
                />
                <div v-else class="no-data-small">暂无餐后记录</div>
            </div>
        </div>
        <!-- 上传数据对话框 -->
        <UploadHealthDataDialog
            v-model="dialogVisible"
            :dataType="currentType"
            :userId="healthStore.currentSelection"
            @success="refreshData"
        />
    </card-layer>
</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { mapState } from 'pinia';
    import { SPARKLINE_CONFIG } from '@/utils/chartConfig';
    import CardLayer from '@/components/Common/CardLayer.vue';
    import BaseTitle from '@/components/Common/BaseTitle.vue';
    import CardCell from '@/components/5_HealthData/Common/CardCell.vue';
    import ChartSparkLine from '@/components/5_HealthData/Common/ChartSparkLine.vue';
    import UploadHealthDataDialog from './UploadHealthDataDialog.vue';

    export default {
        name: 'BloodSugarCard',
        components: {
            CardLayer,
            BaseTitle,
            CardCell,
            ChartSparkLine,
            UploadHealthDataDialog,
        },
        setup() {
            const healthStore = useHealthStore();
            return { healthStore };
        },
        data() {
            return {
                timeControl: 'latest',
                dialogVisible: false,
                currentType: "blood_sugar",
            }
        },
        watch: {
            // 监听切换开关
            timeControl(newVal) {
                if (newVal === '7days') {
                    this.getBsTrend();
                }
            },
            // 如果用户在“七天内”模式下切换了查看的人，也要重新拉取
            'healthStore.currentSelection'(newVal) {
                if (this.timeControl === '7days' && newVal) {
                    this.getBsTrend();
                }
            },
        },
        computed: {
            ...mapState(useHealthStore, ['summary', 'bsHistory']),

            // 趋势图配置
            sparklineConfig() {
                return SPARKLINE_CONFIG;
            },

            // 处理空腹血糖趋势
            fastingDataset() {
                if (!Array.isArray(this.bsHistory)) return [];
                return this.bsHistory
                    .filter(item => item.mealStatus === 0)
                    .map((item, index) => ({
                        period: item.recordDate ? item.recordDate.split(' ')[0] : `记${index + 1}`,
                        value: item.bloodSugar
                    }));
            },

            // 处理餐后血糖趋势
            postprandialDataset() {
                if (!Array.isArray(this.bsHistory)) return [];
                return this.bsHistory
                    .filter(item => item.mealStatus === 1)
                    .map((item, index) => ({
                        period: item.recordDate ? item.recordDate.split(' ')[0] : `记${index + 1}`,
                        value: item.bloodSugar
                    }));
            },

            // 血糖状态判定
            sugarStatus() {
                const val = this.summary.latestFastingBs?.bloodSugar;
                if (!val) return { text: '无数据', color: '#ccc' };
                
                // 判定标准通常只针对空腹
                if (val < 3.9) return { text: '偏低', color: '#ff4444' };
                if (val >= 7.0) return { text: '偏高', color: '#ff4444' };
                return { text: '正常', color: '#42b983' };
            }
        },
        methods: {
            async getBsTrend() { 
                try {
                    await this.healthStore.getBsTrend(this.healthStore.currentSelection);
                } catch (error) {
                    console.error("获取血糖数据失败:", error);
                }
            },

            // 显示上传对话框
            openDialog(type) { 
                this.currentType = type;
                this.dialogVisible = true;
            },

            // 刷新卡片数据
            refreshData() { 
                this.healthStore.getAllData(this.healthStore.currentSelection);
            },
        },
    }
</script>

<style scoped>
    /* 容器 */
    .blood-sugar-card {
        width: 100%;
        height: 100%;
        
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--thin-gap);

        overflow: visible;
    }

    /* 标题行 */
    .title-row {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        display: flex;
        justify-content: row;
        align-items: center;
    }

        /* 按钮区 */
    .button-area {
        width: auto;
        height: 100%;
        margin-left: auto;
        box-sizing: border-box;
        

        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
    }

    .content-row {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--thin-gap);
    }

    .data-view {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        /* padding: 1.5rem; */

        /* display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr); */

        display: flex;
        gap: 1rem;
    }

    .trend-view { 
        flex-direction: column;
    }

    .cell {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    
        background-color: #6eb6ff;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .cell-label { 
        font-size: 20px;
        font-weight: 700;

        
    }

    .cell-value { 
        font-size: 48px;
        font-weight: 700;

        
    }
</style>