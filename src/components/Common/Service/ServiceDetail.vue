<template>
    <div class="service-detail-container">
        <div class="detail-view" v-if="currentService">
            <!-- 信息区 -->
            <div class="info-area">
                <div class="img-area">
                    <img class="img" :src="$getFileUrl(currentService.imgUrl)" alt="图片" />
                </div>
                <div class="introduce-area">
                    <label class="title">{{ currentService.title }}</label>
                    <label class="type">{{ currentService.type }}</label>
                    <label class="price">{{ currentService.price }}</label>

                    <div class="content markdown-body" v-html="renderedMarkdown"></div>

                    <div class="operation-row">
                        <el-button type="primary">预约服务</el-button>
                        <el-button type="primary">收藏</el-button>
                    </div>
                </div>
                
                <!-- <el-carousel></el-carousel> -->
            </div>
            <!-- 评价区 -->
            <div class="rate-area">
                <h1>用户评价</h1>
            </div>
        </div>
        <!-- <div class="loading" v-else>加载中...</div> -->
    </div>
    <div>推荐列表</div>
</template>

<script>
    import { useServiceStore } from '@/stores/service';
    import MarkdownIt from 'markdown-it';

    export default {
        name: 'ServiceDetail',
        components: {

        },
        setup() {
            const serviceStore = useServiceStore();
            return { serviceStore }
        },
        data() {
            return {
                currentService: null,
                markdownRaw: '',
                md: new MarkdownIt({
                    html: true,
                    linkify: true,
                    typography: true,
                }),
            };
        },
        computed: {
            renderedMarkdown() {
                if (this.markdownRaw) {
                    return this.md.render(this.markdownRaw);
                } else {
                    return '暂无详细介绍';
                }
            }
        },
        async mounted() {
            const id = this.$route.params.id;
            const data = await this.serviceStore.getServiceById(id);

            if (data) {
                this.currentService = data;
                await this.loadMarkdown(this.currentService.contentUrl);
            } else {
                // 未来增加一个提示页面，并在倒计时结束后跳转到服务列表页面
                this.$message.error('该服务不存在或已被删除');
                this.$router.push('/PageService');
            }
        },
        methods: {
            async loadMarkdown(url) {
                try {
                    const res = await this.$http.get(this.currentService.contentUrl);
                    this.markdownRaw = res.data;
                } catch (error) {
                    this.markdownRaw = '加载失败';
                }
            }
        },
    }
</script>

<style scoped>
    .service-detail-container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .detail-view {
        width: 100%;
        height: 150rem;

        max-width: 100rem;
        /* padding: clamp(0.25rem, 1.5vw, 1.5rem); */
        padding: clamp(1rem, 2vw, 2rem);
        margin-top: 7rem;
        box-sizing: border-box;

        background-color: rgba(255, 255, 255, 50%);
        backdrop-filter: blur(10px);
        /* box-shadow: 0 0 2rem rgba(0, 0, 0, 10%); */
        border-radius: 2rem;

    }

    .info-area {
        width: 100%;
        height: auto;

        display: grid;
        grid-template-columns: repeat(2, minmax(0rem, 1fr));
        justify-content: center;
        gap: clamp(1rem, 2vw, 2rem);
    }

    .img-area {
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        aspect-ratio: 1 / 1;
    }

    .img {
        width: 100%;
        height: 100%;

        object-fit: cover;
        border-radius: 1rem;

        aspect-ratio: 1 / 1;
    }

    .introduce-area {
        width: 100%;
        height: auto;

        display: flex;
        flex-direction: column;

        gap: clamp(0.25rem, 0.5vw, 0.5rem);
    }

    .type {
        width: fit-content;
        padding: 0 0.1rem 0 0.1rem;
        background-color: #6eb6ff;
        color: #fff;
        border-radius: 0.25rem;

        font-size: clamp(1rem, 1.25vw, 1.25rem);
        font-weight: 500;
    }

    .operation-row {
        width: 100%;
        height: auto;
        margin-top: auto;

        display: flex;
        justify-content: center;
        /* gap: clamp(0.5rem, 1vw, 1rem); */
    }





    @media (max-width: 50rem) {

        .detail-view {
            padding: clamp(0.5rem, 1.5vw, 1.5rem);
            border-radius: 1.5rem;
        }
        .info-area {
            grid-template-columns: repeat(1, minmax(0rem, 1fr));
            gap: clamp(0.5rem, 1.5vw, 1.5rem);
        }
        /* .operation-row {
            position: fixed;
            bottom: 0;
        } */

    }   

    /* 4. Markdown 内容区域的基础样式调整 */
    /* .markdown-body {
        text-align: left;
        line-height: 1.6;
        word-wrap: break-word;
        font-size: 1.1rem;
        color: #333;
        margin-top: 1rem;
    } */

    /* 确保 Markdown 中的图片不会超出容器 */
    /* .markdown-body :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
    } */

    /* 简单的列表样式调整 */
    /* .markdown-body :deep(ul), .markdown-body :deep(ol) {
        padding-left: 1.5rem;
        margin-bottom: 1rem;
    } */






    .test {
        font-size: 1.5rem;
    }
</style>