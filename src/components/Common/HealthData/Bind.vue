<template>
    <div class="bind-container">
        用户绑定页面
    </div>
</template>

<script>
    export default {
        name: 'Bind',
        data() {
            return {

            }
        },
        methods: {
            async bandleBind() {
                const data = {
                    followerId: this.userInfo.id,
                };

                await this.$http.post('/auth/bind', data); 
    
                // 绑定成功后，记得刷新列表
                this.healthStore.getBoundList(this.userInfo.id);
            },  
        },
    }
</script>

<style scoped>
    .bind-container{
        width: 100%;
        height: 150rem;
        max-width: 100rem;
        /* padding: clamp(0.25rem, 1.5vw, 1.5rem); */
        padding: clamp(0.25rem, 1.5vw, 1.5rem);
        margin-top: 7rem;
        box-sizing: border-box;

        background-color: rgba(255, 255, 255, 50%);
        backdrop-filter: blur(10px);
        /* box-shadow: 0 0 2rem rgba(0, 0, 0, 10%); */
        border-radius: 2rem;

        display: flex;
        justify-content: center;
        gap: clamp(0.25rem, 1.5vw, 1.5rem);
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