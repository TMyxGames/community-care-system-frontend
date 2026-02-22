<template>
    <div class="card-cell-container">
        <div class="card-cell-view">
            <div class="cells-label" :style="{ '--label-color' : color }">
                <slot name="label" :style="{ '--label-size' : labelSize }">{{ label }}</slot>
            </div>
            <div class="cells-value">
                <slot>
                    <span class="main-num" :style="{ '--value-size' : valueSize }">{{ value || '--' }}</span>
                    <small class="unit" v-if="unit"> / {{ unit }}</small>
                </slot>
            </div>
        </div>
    </div>
</template>

<script> 
    export default {
        name: 'CardCell',
        props: {
            label: String, // 标签文本
            value: [String, Number], // 数值
            unit: String, // 单位
            color: {
                type: String,
                default: '#5e63b6',
            },
            labelSize: {
                type: String,
                default: 'clamp(1rem, 1.5vw, 1.5rem)'
            },
            valueSize: {
                type: String,
                default: 'clamp(2.5rem, 4.5vw, 4.5rem)'
            }
        },
        data() {
            return {
                
            }
        },

    }
</script>

<style scoped>
    .card-cell-container {
        width: 100%;
        height: auto;

        display: flex;
        justify-content: center;
        align-items: center;

        transition: all 0.25s ease;
    }

    .card-cell-view {
        width: 100%;
        height: 100%;

        padding: 0.5rem;
        border-radius: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .card-cell-container:hover {
        transform: scale(1.05);
        /* box-shadow: 0 0 10px rgba(0, 0, 0, 25%); */
    }

    .cells-label {
        font-size: var(--label-size, clamp(1rem, 1.5vw, 1.5rem));
        font-weight: 700;

        position: relative;
    }

    .cells-label::after {
        content: "";
        height: 0.5rem;
        width: 100%;

        position: absolute;
        left: 0;
        top: 100%;

        background-color: var(--label-color, #5e63b6);

    }

    .cells-value {
        width: auto;
        height: auto;
    }

    .main-num {
        font-size: var(--value-size, clamp(2.5rem, 4.5vw, 4.5rem));
        font-weight: 700;
    }

    .unit {
        font-size: clamp(1rem, 2vw, 1.5rem);
        font-weight: 700;
    }
</style>