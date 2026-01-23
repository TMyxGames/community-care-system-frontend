<template>
    <div class="not-logged-container">
        <label class="title">
            登录以查看您的健康档案
        </label>
    </div>
</template>

<script> 
    export default {
        name: 'NotLogged',
    }
</script>

<style scoped>
    .not-logged-container{
        height: 100%;
        width: 100%;
        max-width: 120rem;
        box-sizing: border-box;
        padding: 2rem;

        background-color: #f8f6f6;

        display: flex;
        justify-content: center;
        
        /* gap: 2rem; */
    }

    .title{
        font-size: 2.5rem;
        font-weight: 600;
        color: #000000;
    }
</style>