<template>
    <div class="layout-container"> 
        <div class="grid-item" v-for="item in dataList" :key="item.id">
            <service-card :serviceData="item"></service-card>
        </div>
    </div>
</template>

<script> 
    import ServiceCard from './ServiceCard.vue';

    export default {
        name: 'ServiceLayout',
        components: {
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
        padding: clamp(0.25rem, 1.5vw, 1.5rem);
        margin-top: 7rem;
        box-sizing: border-box;

        background-color: rgba(255, 255, 255, 50%);
        backdrop-filter: blur(10px);
        /* box-shadow: 0 0 2rem rgba(0, 0, 0, 10%); */
        border-radius: 2rem;

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