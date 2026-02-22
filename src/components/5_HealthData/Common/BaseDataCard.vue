<template>
    <card-layer class="base-data-card thin">
        <div class="title-row">
            <base-title class="title" color="#6eb6ff">基本信息</base-title>
        </div>
        <div class="content-row">
            
            <img class="user-logo" :src="$getFileUrl(summary.avatarUrl) || defaultAvatar" alt="头像">
            
            <div class="data-view">
                <card-cell
                    label="姓名"
                    :value="summary.username"
                    valueSize="clamp(1.5rem, 3vw, 3rem)"
                    color="#5e63b6"
                />
                <card-cell
                    label="性别"
                    :value="summary.sex"
                    valueSize="clamp(1.5rem, 3vw, 3rem)"
                    color="#5e63b6"
                />
                <card-cell
                    label="年龄"
                    :value="summary.age"
                    valueSize="clamp(1.5rem, 3vw, 3rem)"
                    color="#5e63b6"
                />
            </div>

        </div>
    </card-layer>
</template>

<script> 
    import { useHealthStore } from '@/stores/health';
    import { mapState } from 'pinia';
    import CardLayer from '@/components/Common/CardLayer.vue';
    import BaseTitle from '@/components/Common/BaseTitle.vue';
    import CardCell from './CardCell.vue';
    import defaultAvatar from '@/assets/兔兔.jpg';

    export default {
        name: 'BaseDataCard',
        components: {
            CardLayer,
            BaseTitle,
            CardCell,
        },
        setup() {
            const healthStore = useHealthStore();
            return { healthStore };
        },
        data() {
            return {
                defaultAvatar: defaultAvatar,
            }
        },
        computed: {
            ...mapState(useHealthStore, ['userInfo', 'summary']),
        },
        methods: {
        
        },
    }
</script>

<style scoped>
    /* 容器 */
    .base-data-card {
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

    .content-row { 
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        /* background-color: #6eb6ff; */

        display: flex;
        align-items: center;
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

        /* display: grid; */
        /* grid-template-columns: repeat(3, 1fr); */
        /* grid-template-rows: repeat(2, 1fr); */
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

</style>