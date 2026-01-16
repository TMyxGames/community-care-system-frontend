<template>
    <div class="content-list-container">
        <div class="title-area">
            <label class="title">内容列表</label>
        </div>
        <div class="line"></div>
        <div class="content-area">
            <div class="content-item" v-for="item in items" :key="item.id">
                <p>{{ item.text }}</p>
            </div>
        </div>
    </div>
</template>

<script> 
    export default {
        name: 'ContentList',
        data() {
            return {
                items: [
                    {id:1, text: "测试内容1", link: ''},
                    {id:2, text: "测试内容2", link: ''},
                ]
            }
        },
        methods: {

        },
    }

</script>

<style scoped>
    .content-list-container {
        width: 100%;
        height: 100%;

        background-color: rgba(255, 255, 255);
        box-shadow: 0 0 2rem rgba(0, 0, 0, 10%);
        /* border-radius: 0.5rem; */

        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        overflow: hidden;

    }

    .title-area {
        width: 100%;
        height: auto;

        /* background-color: rgba(134, 134, 134, 0.5); */

        display: flex;
    }

    .title {
        font-size: 2rem;
        font-weight: 700;
        
        /* position: absolute; */

    }

    .line {
        width: 100%;
        height: 0.5rem;

        background-color: #ff2e63;
    }

    .content-area {
        width: 100%;
        height: 100%;

        background-color: rgba(134, 134, 134, 0.5);
        display: flex;
        flex-direction: column;
        /* justify-content: flex-start; */
    }

    .content-item {
        width: 100%;
        height: 50px;

        background-color: rgba(134, 134, 134, 0.5);
        border-radius: 2rem;
        display: flex;
        flex-direction: flex-start;
    }

</style>