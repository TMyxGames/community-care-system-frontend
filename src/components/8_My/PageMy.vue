<template>
    <glass-layer class="my-container">
        <div class="sidebar-area">
            <my-side-bar></my-side-bar>
        </div>
        <div class="my-view">
            <router-view></router-view>
        </div>
    </glass-layer>
</template>

<script>
    import GlassLayer from '../Common/GlassLayer.vue';
    import MySideBar from './Common/MySideBar.vue';
    export default {
        name: 'PageMy',
        components: {
            GlassLayer,
            MySideBar,
        },
        data() {
            return {

            }
        },
    }
</script>

<style scoped>
    .my-container {
        width: 100%;
        height: 150rem;
        max-width: 100rem;

        display: grid;
        grid-template-columns: 1fr 4fr;
        justify-content: center;
        gap: clamp(0.25rem, 1.5vw, 1.5rem);
    }

    .sidebar-area {
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        /* position: fixed; */
    }

    .my-view {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: clamp(0.25rem, 1.5vw, 1.5rem);

        background-color: #fff;
        border-radius: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        
    }
</style>