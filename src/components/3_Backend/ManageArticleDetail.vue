<template>
    <div class="head">
        <base-title>{{ isEdit ? '编辑文章' : '编写新文章' }}</base-title>
    </div>
    <div class="manage-article">
        <div class="form-row">
            <el-button type="primary" @click="handleSave(1)">发布文章</el-button>
            <el-button type="primary" @click="handleSave(0)">保存草稿</el-button>
            <el-button type="info" @click="$router.back">返回</el-button>
        </div>
        <div class="form-row">
            <el-input v-model="articleForm.title" placeholder="请输入标题..."></el-input>
        </div>
        <md-editor
            v-model="articleForm.content"
            @onUploadImg="onUploadImg"
            :toolbars-exclude="['github']"
            placeholder="请输入内容..."
            class="editor-body"
        />
        

    </div> 

</template>

<script setup>
    import BaseTitle from '../Common/BaseTitle.vue';
    import { ref, onMounted, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { MdEditor } from 'md-editor-v3';
    import 'md-editor-v3/lib/style.css';
    import request from '@/utils/request';
    import { ElMessage } from 'element-plus';

    const route = useRoute();
    const router = useRouter();

    const articleForm = ref({
        id: '',
        title: '',
        content: '',
        status: ''
    });

    const isEdit = computed(() => route.query.mode === 'edit');

    onMounted(async () => {
        // 从路由中获取预生成的 ID
        const id = route.params.id;
        if (id) {
            articleForm.value.id = id;
            // 如果是编辑已有文章，则加载详情
            if (isEdit.value) {
                loadArticleDetail(id);
            }
        } else {
            ElMessage.error('文章初始化失败，缺少必要标识');
            router.back();
        }
    });

    // 加载草稿数据
    const loadArticleDetail = async (id) => {
        try {
            const res = await request.get(`/article/get/${id}`);

            articleForm.value.title = res.title;
            articleForm.value.content = res.content;
            articleForm.value.status = res.status;
        } catch (error) {
            console.error('加载失败', error);
        }
    };

    // 上传图片
    const onUploadImg = async (files, callback) => {
        const serverUrl = 'http://localhost:8081'
        const res = await Promise.all(
            files.map((file) => {
                return new Promise((rev, rej) => { 
                    const form = new FormData();
                    form.append('file', file);
                    form.append('articleId', articleForm.value.id); 

                    request.post('/article/uploadImage', form, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }).then((res) => {
                        console.log(res);
                        rev(res);
                    }).catch((err) => rej(err));
                });
            })
        );
        // 将后端返回的静态资源路径插入到 Markdown 中
        callback(res.map((item) => {
            const url = item.data || item;
            const relativePath = url.startsWith('/files') ? url : '/files' + url;
            return serverUrl + relativePath;
        }));
    };

    // 保存文章
    const handleSave = async (status) => {
        if (!articleForm.value.title) {
            return ElMessage.warning('文章标题不能为空');
        }
        
        const data = {
            id: articleForm.value.id,
            title: articleForm.value.title,
            content: articleForm.value.content,
            status: status,
        };
        
        try {
            const res = await request.post('/article/save', data);

            ElMessage.success(status === 1 ? '文章已发布' : '草稿已保存');
            // router.push({ name: 'ManageArticleList' });
        } catch (error) {
            ElMessage.error('保存操作失败');
        }
    };
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
        height: calc(100% - 8rem);
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

    .editor-body { 
        height: 100%;
    }
</style>