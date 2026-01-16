<template>
    <div class="base-data-container">
        <div class="title-row">
            <label class="title">基本信息</label>
        </div>
        <div class="content-row">
            
            <img class="user-logo" :src="$getFileUrl(userInfo.avatarUrl) || require('@/assets/兔兔.jpg')" alt="头像">
            
            <div class="data-view">
                <div class="cell">
                    <label class="cell-label">姓名</label>
                    <label class="cell-value">{{ userInfo.username }}</label>
                </div>
                <div class="cell">
                    <label class="cell-label">性别</label>
                    <label class="cell-value">{{ userInfo.sex }}</label>
                </div>
                <div class="cell">
                    <label class="cell-label">年龄</label>
                    <label class="cell-value">{{ userInfo.age }}</label>
                </div>
                <div class="cell">
                    <label class="cell-label">身高</label>
                    <label class="cell-value">{{ userInfo.height }}</label>
                </div>
                <div class="cell">
                    <label class="cell-label">体重</label>
                    <label class="cell-value">{{ userInfo.weight }}</label>
                </div>
            </div>

        </div>
    </div>
</template>

<script> 
    import { useHealthStore } from '@/stores/health';
    import { mapState } from 'pinia';

    export default {
        name: 'BaseDataCard',
        setup() {
            const healthStore = useHealthStore();
            return { healthStore };
        },
        data() {
            return {

            }
        },
        computed: {
            ...mapState(useHealthStore, ['userInfo']),
        },
        methods: {
        
        },
    }
</script>

<style scoped>
        /* 容器 */
    .base-data-container {
        width: 100%;
        height: 100%;
        border-radius: 1rem;
        box-sizing: border-box;

        background-color: rgba(255, 255, 255);
        
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: visible;
    }

    /* 标题行 */
    .title-row {
        width: 100%;
        height: 5rem;
        box-sizing: border-box;
        padding: 1.5rem;

        /* background-color: rgb(255, 255, 255); */

        display: flex;
        justify-content: row;
        align-items: center;
    }

    /* 标题 */
    .title {
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 700;
        margin-left: 1rem;

        position: relative;
    }

    /* 标题装饰线 */
    .title::after {
        content: "";
        height: clamp(1.8rem, 2.2vw, 2.2rem);
        width: 0.5rem;

        position: absolute;
        left: -1rem;
        top: 52%;
        transform: translateY(-50%);

        background-color: #6eb6ff;

    }

    .content-row { 
        width: 100%;
        height: 100%;
        padding: 1.5rem;
        box-sizing: border-box;

        /* background-color: #6eb6ff; */

        display: flex;
        gap: 1.5rem;

    }

    .user-logo {
        width: 10rem;
        height: 10rem;
        /* padding-top: 0.2rem; */

        border-radius: 50%;
    }

    .data-view {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        /* padding: 1.5rem; */

        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        gap: 1rem;
    }

    .cell {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    
        background-color: #6eb6ff;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .cell-label { 
        font-size: 20px;
        font-weight: 700;

        
    }

    .cell-value { 
        font-size: 48px;
        font-weight: 700;

        
    }
</style>