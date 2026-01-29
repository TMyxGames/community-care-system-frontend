<template>
    <div class="head">
        <base-title>接单中心</base-title>
    </div>
    <glass-layer class="staff-container thin">
        <staff-layout/>
    </glass-layer>
</template>

<script>
    import GlassLayer from '../Common/GlassLayer.vue';
    import CardLayer from '../Common/CardLayer.vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import StaffLayout from './Common/StaffLayout.vue';

    export default {
        name: 'PageStaff',
        components: {
            GlassLayer,
            CardLayer,
            BaseTitle,
            StaffLayout,
        },

    }
</script>

<style>
    .head {
        height: 100%;
        width: 100%;
        max-width: 100rem;
        padding: var(--thin-gap);
        box-sizing: border-box;

        display: flex;
        align-items: flex-end;
    }
    .staff-container {
        height: 100rem;
        width: 100%;
        max-width: 100rem;
    }   
</style>