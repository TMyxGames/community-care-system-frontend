<template>
    <label class="base-title" :style="{ '--title-color': color }">
        <slot/>
    </label>
</template>

<script>
import { color } from 'echarts';

    export default {
        name: 'BaseTitle',
        props: {
            color: {
                type: String,
                default: '#ff2e63',
            }
        },
    }
</script>

<style scoped>
    /* 标题 */
    .base-title {
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 700;
        margin-left: 1rem;

        position: relative;
    }

    /* 标题装饰线 */
    .base-title::after {
        content: "";
        height: clamp(1.8rem, 2.2vw, 2.2rem);
        width: clamp(0.4rem, 0.5vw, 0.5rem);

        position: absolute;
        left: -1rem;
        top: 50%;
        transform: translateY(-50%);

        background-color: var(--title-color, #ff2e63);

    }

    @media (max-width: 768px) {
        .base-title {
            font-size: clamp(1rem, 1.5vw, 1.5rem);
            /* margin: clamp(0.5rem, 1vw, 1rem); */
            /* left: 1rem; */
        }

        .base-title::after {
            height: clamp(1.2rem, 1.8vw, 1.8rem);
        }
    }
</style>