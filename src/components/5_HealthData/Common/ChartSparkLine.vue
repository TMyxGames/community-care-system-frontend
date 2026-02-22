<template>
    <div class="sparkline-container">
        <VueDataUi
            component="VueUiSparkline"
            :dataset="dataset"
            :config="finalConfig"
        />
    </div>
</template>

<script>
    import { SPARKLINE_CONFIG } from '@/utils/chartConfig';

    export default {
        props: {
            dataset: { type: Array, required: true },
            color: { type: String, default: '#6eb6ff' }
        },
        computed: {
            finalConfig() {
                return {
                    ...SPARKLINE_CONFIG,
                    style: {
                        ...SPARKLINE_CONFIG.style,
                        line: { ...SPARKLINE_CONFIG.style.line, color: this.color },
                        area: { ...SPARKLINE_CONFIG.style.area, color: this.color }
                    }
                };
            }
        }
    }
</script>

<style>
    .sparkline-container { 
        height: 10rem;
        width: 30rem;
    }
</style>