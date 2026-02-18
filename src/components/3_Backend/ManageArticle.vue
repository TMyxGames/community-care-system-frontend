<template>
    <div class="head">
        <base-title>文章管理</base-title>
    </div>
    <div class="manage-article">
        <div class="form-row">
            <el-button type="primary" @click="goToCreate">添加文章</el-button>
        </div>

        <el-tabs v-model="activeName" class="article-tabs">
            <el-tab-pane label="已发布文章" name="first">
                <article-item
                    v-for="article in articleStore.articleList"
                    :key="article.id"
                    :article-info="article"
                />
            </el-tab-pane>
            <el-tab-pane label="草稿" name="second">
                <article-item
                    v-for="article in articleStore.articleList"
                    :key="article.id"
                    :article-info="article"
                />
            </el-tab-pane>
        </el-tabs>
    </div> 

</template>

<script setup>
    import { useRouter } from 'vue-router';
    import { useArticleStore } from '@/stores/article';
    import { onMounted, watch, ref } from 'vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import ArticleItem from './Common/ArticleItem.vue';
    import request from '@/utils/request';

    const router = useRouter();
    const articleStore = useArticleStore();

    const activeName = ref('first');

    watch(activeName, (newName) => {
        loadDataByTab(newName)
    });

    // 根据选项卡加载数据
    const loadDataByTab = (tabName) => { 
        switch (tabName) {
            case 'first':
                articleStore.getPublished();
                break;
            case 'second':
                articleStore.getDrafts();
                break;
        }
    };

    // 创建新文章
    const goToCreate = async() => {
        try {
            const res = await request.get('/article/preGenerateId');

            const newId = res;
            router.push(`/ManageArticleDetail/${newId}`);
        } catch (error) {
            console.log('创建文章失败：', error);
        }
    };

    onMounted(() => { 
        loadDataByTab(activeName.value);
    });



</script>

<style scoped>
    .head {
        height: auto;
        width: 100%;
        box-sizing: border-box;

        display: flex;
        align-items: center;
    }

    .manage-article {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);
    }

    .form-row { 
        height: auto;
        width: 100%;
        box-sizing: border-box;

        display: flex;
    }
</style>