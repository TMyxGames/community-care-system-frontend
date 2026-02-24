<template>
    <card-layer class="login-placeholder">
        <el-empty description="暂无权限查看此内容">
          <p style="margin-bottom: 20px; color: #909399;">该功能需要登录后才能使用</p>
          <el-button type="primary" @click="goToLogin">立即登录</el-button>
        </el-empty>
    </card-layer>
</template>

<script setup>
    import CardLayer from './CardLayer.vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const goToLogin = () => router.push('/PageLogin');
</script>

<style scoped>
    .login-placeholder {
        width: auto;
    }
</style>