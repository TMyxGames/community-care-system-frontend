<template>
    <div class="service-order-item"> 
        <div class="img-area">
            <img class="img" :src="$getFileUrl(serviceData.imgUrl)" alt="图片" />
        </div>
    </div>
</template>

<script>
    export default {
        name: "ServiceOrderItem",

    }
</script>

<style scoped>
    .service-order-item {
        width: 100%;
        height: auto;

        display: grid;
        grid-template-columns: 20rem 1fr;
        gap: 1rem;
    }

    .img-area {
        width: 20rem;
        height: 20rem;

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
</style>