<template>
    <div class="input-group">
        <input class="input" type="text" autocomplete="off" required="">

        <label class="title1">
            提示文本1
        </label>
        <label class="title2">
            提示文本2
        </label>

    </div>
</template>

<script>
    export default {
        name: 'InputBox3',
    }
</script>

<style scoped>

    /* 重置样式 */
    ::before, ::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    /* 输入框组 */
    .input-group {
        position: relative;
        width: 100%;
        max-width: 20rem;
    }

    /* 输入框 */
    .input {
        font-family: inherit;
        font-size: 18px;
        color: #132843;
        
        width: 100%;
        max-width: 18rem;
        height: 2px;
        padding: 0.5em;
        background-color: rgba(255, 255, 255);
        border: 3px solid #D6DEEB;
        border-radius: 0.5rem;
        outline: none;

        z-index: 0;

        transition: border-color 0.25s;
    }

    /* 标签基础样式 */
    .title1, .title2 { 
        width: auto;

        position: absolute;
        top: 0.75rem;
        left: 0.8rem;
        padding: 0 0.2rem;
        
        font-family: inherit;
        font-size: 18px;
        font-weight: 500;
        /* background-color: rgba(255, 255, 255, 0.5); */

        cursor: text;
        user-select: none;
        pointer-events: none;

        transform-origin: top left;
        transition: all 0.25s ease-in-out;
    }

    /* 标签1 输入框提示 */
    .title1 {
        z-index: 2;
        color: #D6DEEB;
    }
    
    /* 标签2 边框提示 */
    .title2 {
        z-index: 1;
        color: rgba(255, 255, 255, 0);
    }

    .title2::before { 
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 43%;
        height: 0;
        background-color: rgba(255, 255, 255);
        
        transition: all 0.25s ease-in-out;
        z-index: -1;
    }

    .input:focus, .input:valid {
        border-color: #6191D3;
    }

    .input:focus + .title1,
    .input:valid + .title1 {
        transform: translateY(-1.25rem) scale(0.75);
        color: rgba(255, 255, 255, 0);
    }

    .input:focus ~ .title2,
    .input:valid ~ .title2 {
        transform: translateY(-1.25rem) scale(0.75);
        color: #6191D3;
        font-weight: 700;
    }

    .input:focus ~ .title2::before,
    .input:valid ~ .title2::before {
        height: 5px; 
    }


    /* .input:focus {
        border-color: #6191D3;
    }

    .input:focus + .title,
    .input:not(:placeholder-shown) + .title {
        transform: translateY(-1.25rem) scale(0.75);
        color: #6191D3;
        font-weight: 700;
    } */
</style>