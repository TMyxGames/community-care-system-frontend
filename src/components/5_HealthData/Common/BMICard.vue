<template>
    <card-layer class="bmi-card thin">
        <div class="title-row">
            <base-title class="title" color="#6eb6ff">BMI</base-title>
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
            <div class="data-view" 
                v-if="timeControl === 'latest' && summary"
                key="latest"
            >
                <div class="chart-wrapper">
                    <VueDataUi
                        v-if="summary && currentBmiValue > 0"
                        :key="currentBmiValue"
                        component="VueUiGauge"
                        :dataset="gaugeDataset"
                        :config="gaugeConfig"
                    />
                    <div v-else>暂无数据</div>
                </div>
                <card-cell
                    label="身高"
                    :value="summary.latestBmi?.height"
                    unit="cm"
                    color="#ff6f3c"
                />
                <card-cell
                    label="体重"
                    :value="summary.latestBmi?.weight"
                    unit="kg"
                    color="#ff9a3c"
                />
                <card-cell
                    label="BMI"
                    :value="summary.latestBmi?.bmi"
                    color="#ff9a3c"
                />
            </div>
            <div class="data-view" 
                v-else-if="timeControl === '7days' && bmiHistory"
                key="7days"
            >
                <ChartSparkLine
                    v-if="sparklineDataset && sparklineDataset.length > 0"
                    :dataset="sparklineDataset"            
                />
                <div v-else>暂无数据</div>
            </div>

        </div>
    </card-layer>
</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { mapState } from 'pinia';
    import { BMI_GAUGE_CONFIG, SPARKLINE_CONFIG } from '@/utils/chartConfig.js';
    import CardLayer from '@/components/Common/CardLayer.vue';
    import BaseTitle from '@/components/Common/BaseTitle.vue';
    import CardCell from './CardCell.vue';
    import ChartSparkLine from './ChartSparkLine.vue';

    export default {
        name: 'BMICard',
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
                timeControl: "latest",
            }
        },
        watch: {
            // 监听切换开关
            timeControl(newVal) {
                if (newVal === '7days') {
                    this.getBmiTrend();
                }
            },
            // 如果用户在“七天内”模式下切换了查看的人，也要重新拉取
            'healthStore.currentSelection'(newVal) {
                if (this.timeControl === '7days' && newVal) {
                    this.getBmiTrend();
                }
            },
        },
        computed: {
            ...mapState(useHealthStore, ['userInfo', 'summary', 'bmiHistory']),

            // 计算当前BMI
            currentBmiValue() {
                // 增加更严谨的判断，确保返回的是有效数字
                if (!this.summary.latestBmi || !this.summary.latestBmi.height || !this.summary.latestBmi.weight) {
                    return 0; 
                }
                const h = this.summary.latestBmi.height / 100;
                const w = this.summary.latestBmi.weight;
                // 显式转换为数字类型
                return Number((w / (h * h)).toFixed(1));
            },

            // 仪表盘配置
            gaugeConfig() {
                return BMI_GAUGE_CONFIG;
            },

            // 仪表盘数据
            gaugeDataset() {
                const val = parseFloat(this.currentBmiValue);
                if (val <= 0) return { base: 15, max: 40, value: 15, series: [] };
                return {
                    base: 15,
                    max: 40,
                    value: val > 0 ? val : 15,
                    series: [
                        {
                            from: 15,
                            to: 18.4,
                            color: '#008040',
                            id: '111',
                            name: '偏瘦',
                            nameOffsetRatio: 1
                        },
                        {
                            from: 18.5,
                            to: 23.9,
                            color: '#ff7f0e',
                            id: '222',
                            name: '正常',
                            nameOffsetRatio: 1
                        },
                        {
                            from: 24,
                            to: 27.9,
                            color: '#ff0000',
                            id: '333',
                            name: '超重',
                            nameOffsetRatio: 1
                        },
                        {
                            from: 28,
                            to: 40,
                            color: '#0000ff',
                            name: '肥胖',
                            nameOffsetRatio: 1,
                            id: '029d32ce-a8e0-4554-bf44-3b0873ab5afa'
                        }
                    ],
                }
            },

            // 趋势图配置
            sparklineConfig() {
                return SPARKLINE_CONFIG;
            },

            // 趋势图数据
            sparklineDataset() {
                if (!Array.isArray(this.bmiHistory)) return [];
                return this.bmiHistory.map((item, index)  => {
                    const h = item.height / 100;
                    const w = item.weight;
                    const bmi = Number((w / (h * h)).toFixed(1));

                    const dateLabel = item.recordDate ? item.recordDate.split(' ')[0] : `记录${index + 1}`;

                    return {
                        period: dateLabel,
                        value: bmi
                    }
                });
            },
        },
        methods: {
            async getBmiTrend() { 
                try {
                    await this.healthStore.getBmiTrend(this.healthStore.currentSelection);
                } catch (error) {
                    console.error("获取BMI数据失败:", error);
                }
            },
        },
    }
</script>

<style scoped>
    /* 容器 */
    .bmi-card {
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

        display: flex;
        gap: 1rem;
    }

    .cell {
        width: auto;
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

    .chart-wrapper {
        width: 20rem;
        height: 10rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>