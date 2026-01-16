<template>
    <div class="my-container">
        <div class="sidebar-area">
            <my-side-bar></my-side-bar>
        </div>
        <div class="my-view">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import MySideBar from '../Common/My/MySideBar.vue';
    export default {
        name: 'PageMy',
        components: {
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
        /* padding: clamp(0.25rem, 1.5vw, 1.5rem); */
        padding: clamp(0.25rem, 1.5vw, 1.5rem);
        margin-top: 7rem;
        box-sizing: border-box;

        background-color: rgba(255, 255, 255, 50%);
        backdrop-filter: blur(10px);
        /* box-shadow: 0 0 2rem rgba(0, 0, 0, 10%); */
        border-radius: 2rem;

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