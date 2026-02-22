<template>
    <card-layer class="all-data-card thin">
        <div class="title-row">
            <base-title class="title">数据概览</base-title>
        </div>
        <div class="data-display-row">
            <!-- 最新数据 -->
            <div class="latest-data-view"
                v-if="summary"
            >
                <div class="cells-latest">
                    <card-cell   
                        label="身高"
                        :value="summary.latestBmi?.height"
                        unit="cm"
                        color="#ff6f3c"
                    />
                </div>
                <div class="cells-latest">
                    <card-cell   
                        label="体重"
                        :value="summary.latestBmi?.weight"
                        unit="kg"
                        color="#ff9a3c"
                    />
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
                <div class="cells-latest">
                    <card-cell 
                        label= "血糖"
                        :value="absoluteLatestBs?.bloodSugar"
                        unit="mmol/L"
                    >
                        <template #label>
                            血糖<span v-if="absoluteLatestBs">
                                ({{ absoluteLatestBs.mealStatus === 0 ? '空腹' : '餐后' }})
                            </span>
                        </template>
                    </card-cell>

                </div>
            </div>
            <!-- 暂无数据 -->
            <div v-else>
                暂无数据
            </div>
        </div>
                
    </card-layer>
</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { mapState } from 'pinia';
    import CardLayer from '@/components/Common/CardLayer.vue';
    import BaseTitle from '@/components/Common/BaseTitle.vue';
    import CardCell from '@/components/5_HealthData/Common/CardCell.vue';

    export default {
        name: 'AllDataCard',
        components: {
            CardLayer,
            BaseTitle,
            CardCell,
        },
        setup() {
            const healthStore = useHealthStore();
            return { healthStore };
        },
        data() {
            return {

            }
        },
        computed: {
            ...mapState(useHealthStore, ['currentSelection', 'summary']),

            // 获取最新的血糖数据，无论最新数据是空腹还是餐后
            absoluteLatestBs() {
                const fasting = this.summary.latestFastingBs;
                const post = this.summary.latestPostprandialBs;

                if (!fasting && !post) return null;
                if (!fasting) return post;
                if (!post) return fasting;

                // 都有数据时，比较recordDate
                const fastingTime = new Date(fasting.recordDate).getTime();
                const postTime = new Date(post.recordDate).getTime();

                return fastingTime >= postTime ? fasting : post;
            }
        },
        methods: {
            // 格式化时间
            formatDate(dateStr) {
                if (!dateStr) return '--';
                const date = new Date(dateStr);
                const pad = (n) => n < 10 ? '0' + n : n;
                return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`;
            },
        },
    }

</script>

<style scoped>

    /* 容器 */
    .all-data-card {
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

    /* 数据展示行 */
    .data-display-row {
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        /* background-color: #f8f6f6; */

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
    }

    .latest-data-view {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        /* background-color: rgb(255, 255, 255); */
        /* background-color: #6eb6ff; */
        /* border-radius: 1rem; */

        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
    }

    .cells-latest {
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.5rem;

        /* background-color: #6eb6ff; */
        /* border-radius: 1rem; */
    }

    .cells-label {
        font-size: clamp(1rem, 2vw, 1.5rem);
        font-weight: 700;
        /* color: rgb(255, 255, 255); */
        /* padding: 1rem; */

        position: relative;
    }

    .cells-label::after {
        content: "";
        height: 0.5rem;
        width: 100%;

        position: absolute;
        left: 0;
        top: 100%;

        background-color: #5e63b6;

    }

    .cells-value {
        font-size: clamp(2.5rem, 5vw, 4.5rem);;
        font-weight: 700;
    }

    .unit {
        font-size: clamp(1rem, 2vw, 1.5rem);
        font-weight: 700;
    }

    .list-data-view {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        /* background-color: #6eb6ff; */
        /* border-radius: 1rem; */
    }

    /* 定义通用的列比例：第一列日期占 1.5份，其他平分 */
    .list-header, .data-row {
        display: grid;
        grid-template-columns: repeat(3, 1fr) 1.5fr; 
        align-items: center;
        /* padding: 0 1rem; */
    }

    .list-header {
        height: 3.5rem;
        border-bottom: 0.5rem solid #5e63b6; /* 你之前用的紫色 */
        margin-bottom: 0.5rem;
    }

    .header-item {
        font-size: 24px;
        font-weight: 700;

        /* background-color: #6eb6ff; */
        border-radius: 0.5rem;
    }

    .list-body {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    /* .data-row {
        background-color: #5e63b6;
        border-radius: 0.5rem;
    } */

    .value {
        font-size: 32px;
        font-weight: 700;

    }
</style>