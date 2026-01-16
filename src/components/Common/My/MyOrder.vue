<template>
    <div class="my-order-container">
        <label class="title">订单信息</label>
        <div class="form-row">
            
        </div>
        <div class="order-list">
            <div class="cell">
                <label class="order-id">订单编号</label>
                <label class="order-name">订单名称</label>
            </div>
        </div>
    </div>
</template>

<script> 

</script>

<style scoped>
    .my-order-container{
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        /* align-items: center; */

        gap: 0.5rem;
    }

    /* 标题 */
    .title {
        /* font-size: 36px; */
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

        background-color: #ff2e63;

    }

    .form-row {
        width: 100%;
        height: auto;
        min-height: 10rem;

        /* background-color: #6eb6ff; */

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        gap: 0.5rem;
    }
</style>