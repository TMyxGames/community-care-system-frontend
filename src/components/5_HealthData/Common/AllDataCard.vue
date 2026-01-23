<template>
    <div class="all-data-container">
        <div class="title-row">
            <label class="title">全部数据</label>
            <div class="button-area">
                <el-radio-group v-model="allData_timeControl">
                    <el-radio-button
                        label="latest"
                    >最新</el-radio-button>
                    <el-radio-button
                        label="7days"
                    >七天内</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="data-display-row">
            <!-- 最新数据 -->
            <div class="latest-data-view"
                v-if="allData_timeControl === 'latest' && latestData"
                key="latest"
            >
                <div class="cells-latest"
                    v-for="tag in healthTags" :key="tag.label"
                >
                    <div class="cells-label">{{ tag.label }}</div>
                    <div class="cells-value">{{ latestData[tag.prop] }} <small class="unit">/ {{tag.unit}}</small></div>
                </div>
            </div>
            <!-- 暂无数据 -->
            <div v-else-if="allData_timeControl === 'latest' && !latestData">
                暂无数据
            </div>
            <!-- 七天内数据 -->
            <div class="list-data-view"
                v-else key="7days"
            > 
                <div class="list-header">
                    <label class="header-item">收缩压</label>
                    <label class="header-item">舒张压</label>
                    <label class="header-item">血糖</label>
                    <label class="header-item">日期</label>
                </div>
                <div class="list-body">
                    <div class="data-row" v-for="(item, index) in sevenDaysData" :key="index">
                        <div class="data-cell" v-for="tag in healthTags" :key="'d-'+tag.label">
                            <span class="value">{{ item[tag.prop] }}</span>
                            <span class="unit">{{ tag.unit }}</span>
                        </div>
                        <div class="data-cell date-col">{{ formatDate(item.recordDate) }}</div>
                    </div>
                </div>
            </div>

        </div>
                
    </div>
</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { mapState, mapActions } from 'pinia';

    export default {
        name: 'AllDataCard',
        data() {
            return {
                allData_timeControl: 'latest',
                allData: [],
                healthTags: [
                    {label: '收缩压' , prop: 'systolic', unit: 'mmHg'},
                    {label: '舒张压' , prop: 'diastolic', unit: 'mmHg'},
                    {label: '血糖' , prop: 'bloodSugar', unit: 'mmol/L'},
                    // {label: '时间' , prop: 'recordDate', unit: ''},
                ]
            }
        },
        computed: {
            ...mapState(useHealthStore, ['currentSelection', 'latestData', 'sevenDaysData']),
        },
        created() {
            const healthStore = useHealthStore();
            healthStore.getAllData(this.currentUserId);
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
    .all-data-container {
        width: 100%;
        height: 100%;
        border-radius: 1rem;
        box-sizing: border-box;

        background-color: rgba(255, 255, 255);
        
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: visible;
    }

    /* 标题行 */
    .title-row {
        width: 100%;
        height: 5rem;
        box-sizing: border-box;
        padding: 1.5rem;

        /* background-color: rgb(255, 255, 255); */

        display: flex;
        justify-content: row;
        align-items: center;
    }

    /* 标题 */
    .title {
        /* font-size: 36px; */
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 700;
        margin-left: 1rem;

        position: relative;
    }

    /* 标题装饰线 */
    .title::after {
        content: "";
        height: clamp(1.8rem, 2.2vw, 2.2rem);
        width: 0.5rem;

        position: absolute;
        left: -1rem;
        top: 52%;
        transform: translateY(-50%);

        background-color: #ff2e63;

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
        padding: 1.5rem;

        background-color: #f8f6f6;

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

    /* .cells-label::after {
        content: "";
        height: 2.2rem;
        width: 0.5rem;

        position: absolute;
        left: -1rem;
        top: 52%;
        transform: translateY(-50%);

        background-color: #ff2e63;

    } */

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