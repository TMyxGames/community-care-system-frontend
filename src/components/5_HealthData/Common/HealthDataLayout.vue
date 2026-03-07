<template>
    <glass-layer class="health-data-layout-container thin" v-if="this.isMobile != true">
        <div class="first-row">
            <div class="grid-item1">
                <all-data-card/>
            </div>
            <div class="grid-item2">
                <base-data-card/>
            </div>
            <div class="grid-item3">
                <BMICard/>
            </div>
        </div>
        <div class="second-row">
            <div class="grid-item4">
                <BloodPressureCard/>
            </div>
            <div class="grid-item4">
                <BloodSugarCard/>
            </div>
            <div class="grid-item4">
                <AiAdviceCard/>
            </div>

        </div>
    </glass-layer>

    <glass-layer class="health-data-layout-container thin" v-else>
        <div class="first-row">
            <div class="grid-item2">
                <base-data-card/>
            </div>
            <div class="grid-item1">
                <all-data-card/>
            </div>
            <div class="grid-item3">
                <BMICard/>
            </div>
        </div>
        <div class="second-row">
            <div class="grid-item4">
                <BloodPressureCard/>
            </div>
            <div class="grid-item4">
                <BloodSugarCard/>
            </div>
            <div class="grid-item4">
                <AiAdviceCard/>
            </div>

        </div>
    </glass-layer>
</template>

<script>
    import GlassLayer from '@/components/Common/GlassLayer.vue';
    import AllDataCard from './AllDataCard.vue';
    import BaseDataCard from './BaseDataCard.vue';
    import BMICard from './BMICard.vue';
    import BloodPressureCard from './BloodPressureCard.vue';
    import BloodSugarCard from './BloodSugarCard.vue';
    import AiAdviceCard from './AiAdviceCard.vue';

    export default {
        name: 'HealthDataView',
        components: {
            GlassLayer,
            AllDataCard,
            BaseDataCard,
            BMICard,
            BloodPressureCard,
            BloodSugarCard,
            AiAdviceCard,
        },
        inject: ['isMobile'],
        data() {
            return {
                
            }
        },

    }

</script>

<style scoped>
    .health-data-layout-container {
        height: 100%;
        width: 100%;
        max-width: 100rem;

        display: flex;
        flex-direction: column;
    }

    .first-row {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        display: grid;
        grid-template-columns: repeat(4, 1fr);

        padding-bottom: var(--thin-gap);
        gap: var(--thin-gap);

        /* aspect-ratio: 2/1; */
    }

    .second-row {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 1fr);

        padding-bottom: var(--thin-gap);
        gap: var(--thin-gap);

        aspect-ratio: 2/1;
    }

    /* 网格项 */
    [class*="grid-item"] {
        box-sizing: border-box;
        /* aspect-ratio: 1 / 1; */

        
        display: flex;
        justify-content: center;
        align-items: center;
        /* overflow: hidden;  */
    }

    .grid-item1 {
        grid-column: span 2;
        grid-row: span 2;

        width: 100%;
        height: 100%;
        aspect-ratio: 1/1;
    }

    .grid-item2 {
        grid-column: span 2;
        grid-row: span 1;

        width: 100%;
        height: auto;
        /* aspect-ratio: 2/1; */
    }

    .grid-item3 {
        grid-column: span 2;
        grid-row: span 1;
        
        width: 100%;
        height: auto;
        /* aspect-ratio: 2/1; */
    }

    .grid-item4 {
        grid-column: span 2;
        grid-row: span 1;

        width: 100%;
        height: auto;
    }

    @media (max-width: 768px) {
        .first-row {
            grid-template-columns: repeat(2, 1fr);
            height: auto;
            aspect-ratio: none;
        }
        .second-row {
            grid-template-columns: repeat(2, 1fr);
            height: auto;
            aspect-ratio: none;
        }
    }
</style>