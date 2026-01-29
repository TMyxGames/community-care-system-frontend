<template>
    <div class="card-layer">
        <slot/>
    </div>
</template>

<script>
    export default {
        name: 'CardLayer',
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
    .card-layer {
        box-sizing: border-box;
        padding: clamp(1rem, 2vw, 2rem);

        background-color: rgba(255, 255, 255);
        border-radius: 1rem;
    }

    .thin{
        padding:clamp(1rem, 1.5vw, 1.5rem);
    }

    /* 平板屏幕 */
    @media (max-width: 768px) { 
        .card-layer {
            padding:clamp(0.5rem, 1vw, 1rem);
        }
        .thin{
            padding:clamp(0.5rem, 1vw, 1rem);
        }
    }

    /* 移动屏幕 */
    @media (max-width: 640px) { 

    }
</style>