<template>
    <div class="layout-container">
        <glass-layer class="layout-view">
            <div class="grid-item1">
                <!-- 全部数据板块 -->
                <all-data-card></all-data-card>
            </div>
            <div class="grid-item2">
                <base-data-card></base-data-card>
            </div>
            <div class="grid-item3">3</div>
            <div class="grid-item4">4</div>
            <div class="grid-item4">4</div>
            <div class="grid-item4">4</div>
            <div class="grid-item4">4</div>
            <div class="grid-item4">4</div>
        </glass-layer>
    </div>
</template>

<script>
    import GlassLayer from '@/components/Common/GlassLayer.vue';
    import AllDataCard from './AllDataCard.vue';
    import BaseDataCard from './BaseDataCard.vue';

    export default {
        name: 'HealthDataView',
        components: {
            GlassLayer,
            AllDataCard,
            BaseDataCard,
        },
        data() {
            return {
                
            }
        },

    }

</script>

<style scoped>
    .layout-container {
        height: 100%;
        width: 100vw;
        padding: clamp(0rem, 2rem);
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .layout-view {
        height: 100rem;
        width: 100%;
        max-width: 100rem;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        /* grid-template-rows: repeat(4, minmax(0, 1fr)); */
        grid-auto-flow: row dense;
        justify-content: center;
        /* gap: clamp(1rem, 3vw, 2rem); */
        --gap: 2rem;
        grid-auto-rows: minmax(0, 1fr);
        grid-gap: var(--gap);

        margin: 0 auto;
    }

     /* @media (max-width: 60rem) {
        .layout-view {
            grid-template-columns: 1fr;
        }

     } */

    /* 网格项 */
    [class*="grid-item"] {
        /* width: 100%; */
        /* height: auto; */
        /* max-width: 50rem; */
        /* max-height: 50rem; */
        box-sizing: border-box;
        aspect-ratio: 1 / 1;

        border-radius: 1rem;
        background-color: rgba(255, 255, 255);
        box-shadow: 0 0 2rem rgba(0, 0, 0, 10%);
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden; 
    }

    .grid-item1 {
        grid-column: span 2;
        grid-row: span 2;

        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
    }

    .grid-item2 {
        grid-column: span 2;
        grid-row: span 1;

        width: 100%;
        height: auto;
        aspect-ratio: 2/1;
    }

    .grid-item3 {
        grid-column: span 2;
        grid-row: span 1;
        
        width: 100%;
        height: auto;
        aspect-ratio: 2/0.95;
    }

    .grid-item4 {
        grid-column: span 1;
        /* grid-row: 3 / 4; */
    }
</style>