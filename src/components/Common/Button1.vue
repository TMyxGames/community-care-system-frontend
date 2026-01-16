<template>
    <div class="button1-container">
        <button class="button">{{ title }}</button> 
    </div>
</template>

<script>
    export default {
        name: 'Button1',
        props: {
            title: {
                type: String,
                default: '按钮'
            }
        },
        data() {
            return {
                
            }
        },
        emits: ['click'],
    }
</script>

<style scoped>
    .button1-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button {
        width: 10rem;
        height: 3rem;
        
        border: 0.25rem solid rgba(0, 0, 0, 100);
        background-color: rgba(255, 255, 255, 75%);
        backdrop-filter: blur(10px);
        border-radius: 2rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 7.5%);

        font-size: 1.2rem;
        font-weight: 700;
    }
</style>