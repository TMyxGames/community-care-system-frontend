<template>
    <glass-layer class="message-container thin">
        <message-side-bar/>

        <card-layer class="main">
            <router-view/>
        </card-layer>
    </glass-layer>
        

</template>

<script>
    import MidOverlay from '../Common/MidOverlay.vue';
    import GlassLayer from '../Common/GlassLayer.vue';
    import CardLayer from '../Common/CardLayer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import MessageSideBar from './Common/MessageSideBar.vue';

    export default {
        name: "PageMessage",
        components: {
            MidOverlay,
            GlassLayer,
            CardLayer,
            BaseTitle,
            MessageSideBar
        },
        data() {
            return {

            }
        },
        methods: {

        },
    }
</script>

<style scoped>
    .message-container {
        width: 100%;
        
        max-width: 100rem;

        display: grid;
        grid-template-columns: clamp(10rem, 20vw, 20rem) 1fr;
        gap: clamp(1rem, 2vw, 2rem);
    }

    .head {
        height: auto;
        width: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
    }

    .main {
        height: 100%;
        width: 100%;
    }
</style>