<template>
    <card-layer class="advice-card thin">
        <div class="title-row">
            <base-title class="title" color="#6eb6ff">健康分析</base-title>
            <div class="button-area">
                <el-button 
                    type="primary" 
                    round 
                    :loading="healthStore.aiLoading" 
                    @click="handleAnalyze"
                >
                    {{ healthStore.aiAdvice ? '重新分析' : '开始分析' }}
                </el-button>
            </div>
        </div>
        <div class="content-row">
            <div v-if="healthStore.aiLoading" class="ai-loading">
                <el-skeleton :rows="4" animated />
                <p class="loading-hint">DeepSeek 正在为您制定个性化建议...</p>
            </div>

            <div v-else-if="healthStore.aiAdvice" class="ai-content-wrapper">
                <div class="ai-content" v-html="renderedAdvice"></div>
                <div class="ai-footer">分析结果由 DeepSeek 提供，仅供参考</div>
            </div>

            <div v-else class="empty-state">
                <i class="el-icon-magic-stick"></i>
                <p>点击上方按钮，基于最新健康指标获取专业分析</p>
            </div>
        </div>
    </card-layer>
</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { mapState } from 'pinia';
    import { marked } from 'marked';
    import CardLayer from '@/components/Common/CardLayer.vue';
    import BaseTitle from '@/components/Common/BaseTitle.vue';

    export default {
        name: 'AiAdviceCard',
        components: {
            CardLayer,
            BaseTitle,
        },
        setup() {
            const healthStore = useHealthStore();
            return { healthStore };
        },
        computed: {
            ...mapState(useHealthStore, ['aiAdvice', 'aiLoading']),
            // 使用 marked 渲染 Markdown 格式
            renderedAdvice() {
                return this.aiAdvice ? marked(this.aiAdvice) : '';
            }
        },
        methods: {
            handleAnalyze() {
                // 调用 store 中的获取方法
                this.healthStore.getAiAdvice();
            }
        }
    }
</script>

<style scope>
/* 容器 */
    .advice-card {
        width: 100%;
        height: 100%;
        
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--thin-gap);

        overflow: visible;
    }

    /* 标题行 */
    .title-row {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        display: flex;
        justify-content: row;
        align-items: center;
    }

    /* 按钮区 */
    .button-area {
        width: auto;
        height: 100%;
        margin-left: auto;
        box-sizing: border-box;
        

        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;
    }

    .content-row {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--thin-gap);
    }
</style>