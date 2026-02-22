<template>
    <card-layer class="systolic-card thin">
        <div class="title-row">
            <base-title class="title" color="#6eb6ff">血压</base-title>
            <div class="button-area">
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
        <div class="content-row">
            <div class="data-view" v-if="timeControl === 'latest'" key="latest">
                <div class="row">

                </div>
                <div class="cells-latest">
                    <card-cell   
                        label="收缩压"
                        :value="summary.latestBp?.systolic"
                        unit="mmHg"
                        color="#c61951"
                    />
                </div>
                <div class="cells-latest">
                    <card-cell   
                        label="舒张压"
                        :value="summary.latestBp?.diastolic"
                        unit="mmHg"
                        color="#f64662"
                    />
                </div>
                <div class="cells-latest">
                    <card-cell   
                        label="静息心率"
                        :value="summary.latestBp?.heartRate"
                        unit="BPM"
                        color="#ea0599"
                    />
                </div>
            </div>

            <div class="data-view trend-view" v-else key="7days">
                <ChartSparkLine
                    v-if="systolicDataset && systolicDataset.length > 0"
                    :dataset="systolicDataset" color="#c61951"   
                />
                <ChartSparkLine
                    v-if="diastolicDataset && diastolicDataset.length > 0"
                    :dataset="diastolicDataset" color="#f64662"           
                />
                <div v-else>暂无数据</div>
            </div>

        </div>
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

    export default {
        name: 'BloodPresureCard',
        components: {
            CardLayer,
            BaseTitle,
            CardCell,
            ChartSparkLine,
        },
        setup() {
            const healthStore = useHealthStore();
            return { healthStore };
        },
        data() {
            return {
                timeControl: 'latest',
            }
        },
        watch: {
            // 监听切换开关
            timeControl(newVal) {
                if (newVal === '7days') {
                    this.getBpTrend();
                }
            },
            // 如果用户在“七天内”模式下切换了查看的人，也要重新拉取
            'healthStore.currentSelection'(newVal) {
                if (this.timeControl === '7days' && newVal) {
                    this.getBpTrend();
                }
            },
        },
        computed: {
            ...mapState(useHealthStore, ['summary', 'bpHistory']),

            // 趋势图配置
            sparklineConfig() {
                return SPARKLINE_CONFIG;
            },

            // 处理收缩压数据
            systolicDataset() {
                if (!Array.isArray(this.bpHistory)) return [];
                return this.bpHistory.map((item, index) => ({
                    period: item.recordDate ? item.recordDate.split(' ')[0] : `记录${index + 1}`,
                    value: item.systolic
                }));
            },

            // 处理舒张压数据
            diastolicDataset() {
                if (!Array.isArray(this.bpHistory)) return [];
                return this.bpHistory.map((item, index) => ({
                    period: item.recordDate ? item.recordDate.split(' ')[0] : `记录${index + 1}`,
                    value: item.diastolic
                }));
            },

            // 血压状态判定
            bpStatus() {
                if (!this.latestData) return { text: '无数据', color: '#ccc' };
                const sys = this.latestData.systolic;
                const dia = this.latestData.diastolic;

                if (sys >= 140 || dia >= 90) return { text: '高血压', color: '#ff4444' };
                if (sys >= 120 || dia >= 80) return { text: '正常高值', color: '#ffbb33' };
                return { text: '正常', color: '#42b983' };
            },

        },
        methods: {
            async getBpTrend() { 
                try {
                    await this.healthStore.getBpTrend(this.healthStore.currentSelection);
                } catch (error) {
                    console.error("获取血压数据失败:", error);
                }
            },
        },
    }
</script>

<style scoped>
    /* 容器 */
    .systolic-card {
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