<template>
    <div class="glass-layer">
        <slot/>
    </div>
</template>

<script>
    export default {
        name: 'GlassLayer',
        props: {
            width: {
                type: String,
                default: '1rem',
            },
            height: {
                type: String,
                default: '1rem',
            }
        },
    }
</script>

<style scoped>
    .glass-layer {
        box-sizing: border-box;
        padding: clamp(1rem, 1.5vw, 1.5rem);

        background-color: rgba(255, 255, 255, 50%);
        box-shadow: 0 0 10px rgba(0, 0, 0, 25%);
        backdrop-filter: blur(10px);
        border-radius: 2rem;
    }

    /* 平板屏幕 */
    @media (max-width: 768px) { 
        .glass-layer {
            padding:clamp(0.5rem, 1vw, 1rem);
            border-radius: 1.25rem;
        }
    }

    /* 移动屏幕 */
    @media (max-width: 640px) { 

    }
</style>