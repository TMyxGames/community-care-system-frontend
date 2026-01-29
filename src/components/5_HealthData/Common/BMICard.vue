<template>
    <card-layer class="bmi-card thin">
        <div class="title-row">
            <base-title class="title" color="#6eb6ff">BMI</base-title>
        </div>
        <div class="content-row">
            <div class="data-view">
                <div class="cell">
                    <label class="cell-label">身高</label>
                    <label class="cell-value">{{ userInfo.height }}</label>
                </div>
                <div class="cell">
                    <label class="cell-label">体重</label>
                    <label class="cell-value">{{ userInfo.weight }}</label>
                </div>
            </div>

        </div>
    </card-layer>
</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { mapState } from 'pinia';
    import CardLayer from '@/components/Common/CardLayer.vue';
    import BaseTitle from '@/components/Common/BaseTitle.vue';

    export default {
        name: 'BMICard',
        components: {
            CardLayer,
            BaseTitle,
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
            ...mapState(useHealthStore, ['userInfo']),
        },
        methods: {
            
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

    .data-view {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        /* padding: 1.5rem; */

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 1rem;
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