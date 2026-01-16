<template>
    <div class="option-container" :class="{ 'is-active': active }">
        <span class="option-text">{{ name }}</span>
    </div>
</template>

<script>
    export default {
        name: 'GlobalHeaderOption',
        props: {
            name: String,
            active: Boolean,
        },
        methods: {

        }
    }
</script>

<style scoped>
    .option-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;

        height: 50px;
        padding: 0px 10px 0px 10px; 
        /* background-color: rgba(255, 255, 255, 25%); */

        position: relative;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }
    
    .option-text {
        font-family: 'HarmonyOS Sans SC';
        font-weight: 900;
        font-size: 20px;
        user-select: none;
        color: #F8F6F6;
        position: relative;
        white-space: nowrap;
        transition: all 0.3s ease;
        z-index: 1;
    }

    .option-text::after {
        content: '';
        position: absolute;
        z-index: -1;
        bottom: -5px;
        left: 0;
        width: 0;
        height: 5px;
        background-color: #ff2e63;
        backdrop-filter: blur(10px);
        transform-origin: left;
        transition: width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .option-container:not(.is-active):hover .option-text::after {
        width: 100%;
    }

    .is-active .option-text {
        transform: scale(1.2);
    }

    .is-active .option-text::after {
        bottom: 2px;
        width: 100%;
        height: 10px;
        background-color: #ff2e63; /* 红色下划线 */
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
    }
</style>