<template>
    <div class="article-item bd-default" @click="toDetail">
        <h1 class="title bd-h1">
            {{ articleInfo.title }}
        </h1>
    </div>
</template>

<script>

    export default {
        name: "ContentListItem",
        components: {
            
        },
        props: {
            articleInfo: {
                type: Object,
                required: true,
            }
        },
        data() {
            return {
                
            }
        },
        methods: {
            
            toDetail() {
                this.$router.push(`/ArticleDetail/${this.articleInfo.id}`);
            }
            
        },

    }
</script>

<style scoped>
    .article-item {
        width: 100%;
        height: auto;
        transition: all 0.25s ease;
    }

    .article-item:hover {
        transform: scale(1.025);
    }
</style>