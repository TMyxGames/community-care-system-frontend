<template>
    <div class="staff-layout-container thin">
        <div class="first-row">
            <div class="grid-item1">
                <staff-order-card/>
            </div>
            <div class="grid-item2">
                <service-area-card/>
            </div>
            <div class="grid-item3">

            </div>
        </div>
        <div class="second-row">

        </div>
    </div>
</template>

<script>
    import GlassLayer from '@/components/Common/GlassLayer.vue';
    import StaffOrderCard from './StaffOrderCard.vue';
    import ServiceAreaCard from './ServiceAreaCard.vue';

    export default {
        name: 'HealthDataView',
        components: {
            GlassLayer,
            StaffOrderCard,
            ServiceAreaCard,
        },
        data() {
            return {
                
            }
        },

    }

</script>

<style scoped>
    .staff-layout-container {
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
        /* grid-template-rows: repeat(2, 1fr); */

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

    @media (max-width: 640px) {
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