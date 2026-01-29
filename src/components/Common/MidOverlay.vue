<template>
    <div class="mid-overlay">
        <slot/>
    </div>
</template>

<script>
    export default {
        name: "MidOverlay",
    }
</script>

<style>
    .mid-overlay {
        width: 100%;
        height: 100%;

        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>