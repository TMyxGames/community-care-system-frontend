<template>
    <mid-overlay>
        <glass-layer class="article-detail-container">
            <div class="header">
                <div class="title" v-if="currentArticle">{{ currentArticle?.title }}</div>
            </div>
            <card-layer class="content-area thin" v-if="markdownRaw">
                <div class="bd-markdown" v-html="$md.render(markdownRaw)"></div>
            </card-layer>
            <card-layer class="content-area thin" v-else>
                <div class="bd-markdown">文章加载中...</div>
            </card-layer>
        </glass-layer>
    </mid-overlay>
    
</template>

<script setup> 
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { useArticleStore } from '@/stores/article';
    import request from '@/utils/request';
    import MidOverlay from '../Common/MidOverlay.vue';
    import GlassLayer from '../Common/GlassLayer.vue';
    import CardLayer from '../Common/CardLayer.vue';
    import { Elmessage } from 'element-plus';

    const articleStore = useArticleStore();
    const route = useRoute();

    const currentArticle = ref(null);
    const markdownRaw = ref("");

    onMounted (async () => { 
        const id = route.params.id;
        const data = await articleStore.getArticleById(id);

        if (data) {
            currentArticle.value = data;
            markdownRaw.value = data.content;
        } else {
            Elmessage.error("文章不存在或已被删除");
        }
    });

</script>

<style scoped>
    .article-detail-container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);
    }

    .title {
        display: flex;
        justify-content: center;
    }

</style>