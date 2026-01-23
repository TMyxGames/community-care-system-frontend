<template>
    <glass-layer class="layout-container"> 
        <div class="grid-item" v-for="item in dataList" :key="item.id">
            <service-card :serviceData="item"></service-card>
        </div>
    </glass-layer>
</template>

<script> 
    import GlassLayer from '@/components/Common/GlassLayer.vue';
    import ServiceCard from './ServiceCard.vue';

    export default {
        name: 'ServiceLayout',
        components: {
            GlassLayer,
            ServiceCard,
        },
        data() {
            return {
            }
        },
        props: {
            dataList: {
                type: Array,
                requiered: true,
            }
        },
        methods: {
        }
    }
</script>

<style scoped>
    .layout-container {
        width: 100%;
        height: 100%;
        max-width: 100rem;


        display: grid;
        grid-template-columns: repeat(4, minmax(0rem, 1fr));
        /* grid-template-rows: repeat(auto-fit, minmax(0rem, 1fr)); */
        gap: clamp(0.25rem, 1.5vw, 1.5rem);
    }


    @media (max-width: 70rem) {

        .layout-container {
            /* grid-template-columns: repeat(3, minmax(0rem, 1fr)); */
            grid-template-columns: 1fr 1fr 1fr;
        }

    }

    @media (max-width: 50rem) {

        .layout-container {
            grid-template-columns: repeat(2, minmax(0rem, 1fr));
            border-radius: 0.8rem;
        }

    }

    .grid-item {
        height: auto;
        width: 100%;

        aspect-ratio: 2/3;
    }
</style>