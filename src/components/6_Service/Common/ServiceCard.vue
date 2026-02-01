<template>
    <div class="service-card">
        <div class="img-area">
            <img class="img" :src="$getFileUrl(serviceData.imgUrl)" alt="图片" @click="toDetail">
        </div>
        <div class="info-area">

            <div class="title-row">
                <label class="title">{{ serviceData.title }}</label>
                <label class="price">{{ serviceData.price }}</label>
            </div>
            <div class="type-row">
                <label class="type">{{ serviceData.type }}</label>
            </div>
            <div class="introduce-row">
                <label class="introduce">{{ serviceData.introduce }}</label>
            </div>
            <div class="operation-row">
                <el-button class="button" @click="toDetail">
                    <p class="button-text">查看详情</p>
                </el-button>
                <el-button class="button">
                    <p class="button-text">预约服务</p>
                </el-button>
                <div class="time-area">
                    <label class="time-label">营业时间</label>
                    <label class="time">{{ serviceData.workTime }}</label>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import CardLayer from '@/components/Common/CardLayer.vue';

    export default {
        name: "ServiceCard",
        components: {
            CardLayer,
        },
        props: {
            serviceData: {
                type: Object,
                requiered: true,
            }
        },
        methods: {
            handleClick() {
                this.$emit("click");
            },

            toDetail() {
                // 当点击“查看详情”时
                this.$router.push(`/ServiceDetail/${this.serviceData.id}`);
            },
        }
    }
</script>

<style scoped>
    /* 卡片主体 */
    .service-card {
        width: 100%;
        height: 100%;
        /* padding: 1rem; */
        box-sizing: border-box;

        background-color: #fff;
        border-radius: 1rem;
        box-shadow: 0 0 2rem rgba(0, 0, 0, 10%);

        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    @media (max-width: 50rem) {

        .service-card {
            border-radius: 0.5rem;
        }

    }

    /* 图片区域 */
    .img-area {
        width: 100%;
        height: auto;
        overflow: hidden;

        /* aspect-ratio: 7 / 5; */
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
    }

    /* 图片 */
    .img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        /* aspect-ratio: 7 / 5; */
        aspect-ratio: 1 / 1;
    }

    .info-area { 
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: clamp(0.3rem, 0.5vw, 0.5rem);

        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }

    /* 标题区域 */
    .title-row {
        width: 100%;
        height: auto;
        padding-bottom: clamp(0.4rem, 0.8vw, 0.8rem);
        box-sizing: border-box;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: clamp(0.25rem, 0.5vw, 0.5rem);
    }

    /* 标题 */
    .title {
        font-size: clamp(1rem, 1.5vw, 1.5rem);
        font-weight: 700;
        line-height: clamp(1rem, 1.5vw, 1.5rem);

        /* overflow: hidden; */

        position: relative;
    }

    .title::after {
        content: "";
        height: clamp(0.2rem, 0.4vw, 0.4rem);
        width: 100%;
        max-width: 6rem;

        position: absolute;
        left: 0;
        top: clamp(1.25rem, 1.8vw, 1.8rem);

        background-color: #5e63b6;

    }

    .price {
        margin-left: auto;
        color: #ffc93c;
        font-size: clamp(1rem, 1.5vw, 1.5rem);
        font-weight: 700;
        line-height: clamp(1rem, 1.5vw, 1.5rem);

        position: relative;
    }

    .type-row { 
        padding-top: clamp(0.2rem, 0.4vw, 0.4rem);
        padding-bottom: clamp(0.2rem, 0.4vw, 0.4rem);
    }

    .type {
        padding: 0 0.1rem 0 0.1rem;
        background-color: #6eb6ff;
        color: #fff;
        border-radius: 0.25rem;

        font-size: clamp(0.75rem, 1vw, 1rem);
        font-weight: 500;
    }

    /* 介绍区域 */
    .introduce-row {
        width: 100%;
        height: auto;
        box-sizing: border-box;

        /* position: relative; */

        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    /* 介绍 */
    .introduce {
        font-size: clamp(0.8rem, 1vw, 1rem);
        font-weight: 500;
        line-height: clamp(0.8rem, 1vw, 1rem);
    }

    /* 操作区域 */
    .operation-row {
        width: 100%;
        height: auto;
        /* padding: 0.5rem; */
        /* padding: clamp(0.4rem, 0.7vw, 0.7rem); */
        box-sizing: border-box;
        margin-top: auto;

        display: flex;
        align-items: flex-end;
        gap: 0.5rem;
    }

    .button {
        height: clamp(2rem, 2.5vw, 2.5rem);
        width: clamp(3rem, 5vw, 5.5rem);
        border-radius: 0.5rem;

        margin: 0;
    }

    .button-text {
        font-size: clamp(0.75rem, 1vw, 1rem);
        font-weight: 500;
    }

    .time-area {
        margin-left: auto;
        display: flex;

        flex-direction: column;

    }

    .time-label { 
        font-size: clamp(0.7rem, 1vw, 1rem);
        font-weight: 500;
    }

    .time {
        font-size: clamp(0.75rem, 1.2vw, 1.2rem);
        font-weight: 500;
    }
</style>