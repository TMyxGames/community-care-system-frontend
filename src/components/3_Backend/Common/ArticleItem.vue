<template>
    <div class="article-item-container">
        <div class="info-content">
            <div class="info-detail">
                <span class="title">{{ articleInfo.title }}</span>
                <span class="price">{{ formatTime(articleInfo.uploadTime) }}</span>
            </div>
            <div class="action">
                <el-button
                    v-if="articleInfo.status === 0"
                    type="primary"
                    size="small"
                    @click="handlePublish"
                >发布</el-button>
                <el-button
                    type="primary"
                    size="small"
                    plain
                    @click="handleEdit"
                >编辑</el-button>
                <el-button
                    type="danger"
                    size="small"
                    @click="handleDelete"
                >删除</el-button>
            </div>
        </div>
    </div>
</template>

<script setup> 
    import { useRouter } from 'vue-router'
    import { useArticleStore } from '@/stores/article';
    import { ElMessageBox, ElMessage } from 'element-plus'
    import request from '@/utils/request';

    const router = useRouter();
    const articleStore = useArticleStore();

    const props = defineProps({
        articleInfo: {
            type: Object,
            required: true,
        }
    });

    // 发布文章（将文章状态改为1）
    const handlePublish = async () => {
        try {
            const res = await request.post('/article/save', {
                id: props.articleInfo.id,
                title: props.articleInfo.title,
                status: 1,
            });
            ElMessage.success('文章已发布');
            articleStore.getDrafts();
        } catch (error) {
            ElMessage.error('发布失败');
        }
    };

    // 编辑文章
    const handleEdit = () => {
        router.push({
            name: 'ManageArticleDetail', // 对应你路由配置的名字
            params: { id: props.articleInfo.id },
            query: { mode: 'edit' }
        });
    };

    // 删除文章
    const handleDelete = () => {
        ElMessageBox.confirm(
            '此操作将永久删除该文章及所有关联图片，是否继续?',
            '提示',
            { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        ).then(async () => {
            const res = await request.delete(`/article/delete/${props.articleInfo.id}`);
            ElMessage.success('删除成功');
            articleStore.getDrafts(); // 刷新列表
        }).catch(() => {});
    };

    // 格式化日期
    const formatTime = (time) => {
        if (!time) return '';
        return time.replace('T', ' ').substring(0, 16);
    };







</script>

<style scoped>
    .article-item-container {
        width: auto;
        height: 10rem;
        padding: var(--thin-gap);
        /* box-sizing: border-box; */

        background-color: #cadefc;
        border-radius: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: var(--thin-gap);

    }

    .info-header {
        display: flex;
        align-items: center;
        gap: var(--thin-gap);
    }

    .info-content {
        display: flex;
        align-items: center;
        gap: var(--thin-gap);
    }

    .info-detail {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .action {
        display: flex;
        align-items: center;

        margin-left: auto;
    }
</style>