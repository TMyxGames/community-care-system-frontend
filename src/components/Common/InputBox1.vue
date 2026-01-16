<!-- 未来改动 -->
<!-- 增加清除按钮出现消失动画 -->
<!-- 增加显示密码按钮出现消失动画 -->

<template>
    <!-- 组件主体 -->
    <div class="input-group" 
        :class="[
            'status-' + status,
            { 'is-disabled': disabled },
            { 'is-always-active': alwaysActive }
        ]" 
        :style="{ width: moduleWidth, height: moduleHeight }"
    >
        <!-- 输入框 -->
        <input
            class="input"
            :id="uuid"
            :type="inputType"
            :value="modelValue"
            :disabled="disabled"
            @input="$emit('update:modelValue', $event.target.value)"
            @focus="handelFocus"
            @blur="handelBlur"
            autocomplete="off"
            required=""
        >
        <!-- 提示标签1 -->
        <label class="title1" :for="uuid">
            {{ title1 }}
        </label>
        <!-- 提示标签2 -->
        <label class="title2" :for="uuid">
            {{ title2 }}
        </label>
        <!-- 边框占位 -->
        <label class="border-gap">
            {{ title2 }}
        </label>
        <!-- 按钮组 -->
        <transition-group name="btn-fade" tag="div" class="btn-group">
            <!-- 显示密码按钮 -->
            <div class="show-password-btn" key="pw-btn"
                v-if="type === 'password' && showPassword && modelValue && !disabled"
                @click="handelShowPassword"
            >
                <div class="show-password-icon" :class="isPasswordVisible ? 'eye-open' : 'eye-close'"></div>
            </div>
            <!-- 清除按钮 -->
            <div class="clear-btn" key="clear-btn"
                v-if="clearable && modelValue && isFocused && !disabled"
                @mousedown.prevent="handelClear"
            >
                <div class="clear-icon"></div>
            </div>
        </transition-group>
    </div>
</template>

<script>
    export default {
        name: 'InputBox1',
        props: {
            // 绑定值
            modelValue: String,
            type: {
                type: String,
                default: ''
            },
            // 提示文本1
            title1: {
                type: String,
                default: ''
            },
            // 提示文本2
            title2: {
                type: String,
                default: ''
            },
            // 组件宽度
            moduleWidth: {
                type: String,
                default: '10rem'
            },
            // 组件高度
            moduleHeight: {
                type: String,
                default: '3rem'
            },
            // 组件状态
            status: {
                type: String,
                default: 'default'
            },
            // 禁用状态
            disabled: {
                type: Boolean,
                default: false
            },
            // 常态激活
            alwaysActive: {
                type: Boolean,
                default: false
            },
            // 清除按钮
            clearable: {
                type: Boolean,
                default: false
            },
            // 显示密码
            showPassword: {
                type: Boolean,
                default: false
            },
        },
        emits: ['update:modelValue','focus','blur','input'],
        data() {
            return {
                uuid: `input-${Math.random().toString(36).slice(2, 9)}`,
                isFocused: false,
                isPasswordVisible: false,
            }
        },
        computed: {
            // 输入框类型
            inputType() {
                if (this.type === 'password') {
                    return this.isPasswordVisible ? 'text' : 'password';
                }
                return this.type;
            }
        },
        methods: {
            // 获取焦点事件
            handelFocus(event) {
                this.isFocused = true;
                this.$emit('focus', event);
            },
            // 失去焦点事件
            handelBlur(event) {
                this.isFocused = false;
                this.$emit('blur', event);
            },
            // 清除按钮点击事件
            handelClear() {
                this.$emit('update:modelValue', '');
                const inputEl = document.getElementById(this.uuid);
                if (inputEl) inputEl.focus();
            },
            // 显示密码按钮点击事件
            handelShowPassword() {
                this.isPasswordVisible = !this.isPasswordVisible;
                // const inputEl = document.getElementById(this.uuid);
                // if (inputEl) inputEl.focus();
            },
        }
    }
</script>

<style scoped>

    /* 重置样式 */
    ::before, ::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    /* 组件主体 */
    .input-group {
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* 输入框 */
    .input {
        font-family: inherit;
        font-size: 18px;
        color: #132843;
        
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        padding: 0.5em;
        background-color: rgba(255, 255, 255);
        border: 3px solid #D6DEEB;
        border-radius: 0.5rem;
        outline: none;

        z-index: -1;

        transition: border-color 0.25s;
    }

    /* 提示标签基础样式 */
    .title1, .title2 { 
        width: auto;
        max-width: 18rem;

        position: absolute;
        top: 0.75rem;
        left: 0.55rem;
        padding: 0 0.2rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        
        font-family: inherit;
        font-size: 18px;
        font-weight: 500;

        cursor: text;
        user-select: none;
        pointer-events: none;

        transform-origin: top left;
        transition: all 0.25s ease-in-out;
        /* transform: translateY(50%) */
    }

    /* 标签1 输入框提示标签 */
    .title1 {
        z-index: 2;
        color: #D6DEEB;
    }
    
    /* 标签2 边框提示标签 */
    .title2 {
        z-index: 1;
        color: rgba(255, 255, 255, 0);
    }

    /* 边框占位 */
    .border-gap {
        width: auto;
        max-width: 18rem;

        position: absolute;
        top: 0.75rem;
        left: 0.55rem;
        padding: 0 0.2rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        font-family: inherit;
        font-size: 18px;
        font-weight: 700;
        color: rgba(255, 255, 255, 0);

        cursor: text;
        user-select: none;
        pointer-events: none;

        transform-origin: top left;
        transform: translateY(-1.25rem) scale(0.75);
        transition: all 0.25s ease-in-out;

        z-index: 0;
    }

    /* 边框占位元素 */
    .border-gap::before { 
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0.65rem;
        height: 5px;
        width: 100%;
        background-color: rgba(255, 255, 255);

        transform-origin: center center;
        transform: scaleX(0);
        transition: all 0.25s ease-in-out;
        z-index: -1;
    }

    /* 输入框获取焦点时的样式 */
    .input:focus, .input:valid,
    .is-always-active .input {
        border-color: #6191D3;
    }

    /* 输入框获取焦点时标签1行为 */
    .input:focus + .title1,
    .input:valid + .title1,
    .is-always-active .title1 {
        transform: translateY(-1.25rem) scale(0.75);
        color: rgba(255, 255, 255, 0);
    }

    /* 输入框获取焦点时标签2行为 */
    .input:focus ~ .title2,
    .input:valid ~ .title2,
    .is-always-active .title2 {
        transform: translateY(-1.25rem) scale(0.75);
        color: #6191D3;
        font-weight: 700;
        max-width: 23.9rem;
    }

    /* 输入框获取焦点时边框占位行为 */
    .input:focus ~ .border-gap,
    .input:valid ~ .border-gap,
    .is-always-active .border-gap {
        max-width: 24.1rem;
    }

    /* 输入框获取焦点时边框占位元素行为 */
    .input:focus ~ .border-gap::before,
    .input:valid ~ .border-gap::before,
    .is-always-active .border-gap::before {
        transform: scaleX(1);
    }

    /* ========== 成功状态样式 ========== */
    /* - 常态 - */
    .input-group.status-success .input {
        border-color: #55e9bc;
    }
    /* - 获取焦点 - */
    .input-group.status-success .input:focus {
        border-color: #55e9bc;
    }
    /* - 获取焦点时标签2的样式 - */
    .input-group.status-success .input:focus ~ .title2,
    .input-group.status-success .input:valid ~ .title2,
    .input-group.status-success.is-always-active .title2 {
        color: #55e9bc;
    }

    /* ========== 警告状态样式 ========== */
        /* - 常态 - */
    .input-group.status-warning .input {
        border-color: #ffd24b;
    }
    /* - 获取焦点 - */
    .input-group.status-warning .input:focus {
        border-color: #ffd24b;
    }
    /* - 获取焦点时标签2的样式 - */
    .input-group.status-warning .input:focus ~ .title2,
    .input-group.status-warning .input:valid ~ .title2,
    .input-group.status-warning.is-always-active .title2 {
        color: #ffd24b;
    }

    /* ========== 错误状态样式 ========== */
    /* - 常态 - */
    .input-group.status-danger .input {
        border-color: #F44336;
    }
    /* - 获取焦点 - */
    .input-group.status-danger .input:focus {
        border-color: #F44336;
    }
    /* - 获取焦点时标签2的样式 - */
    .input-group.status-danger .input:focus ~ .title2,
    .input-group.status-danger .input:valid ~ .title2,
    .input-group.status-danger.is-always-active .title2 {
        color: #F44336;
    }

    /* ========== 禁用状态样式 ========== */
    /* - 常态 - */
    .input-group.is-disabled .input {
        background-color: #f5f7fa !important;
        /* border-color: #e4e7ed !important; */
        border-color: #c0c4cc !important;
        color: #c0c4cc !important;
        cursor: not-allowed;
    }
    /* - 禁用时标签1的样式 - */
    .input-group.is-disabled .title1 {
        color: #c0c4cc !important;
        cursor: not-allowed;
    }
    /* - 获取焦点 - */
    .input-group.is-disabled .input:focus + .title1,
    .input-group.is-disabled .input:valid + .title1 {
        transform: none;
        border-color: #c0c4cc !important;
    }
    /* - 获取焦点时标签2的样式 - */
    .input-group.is-disabled .input:focus ~ .title2,
    .input-group.is-disabled .input:valid ~ .title2 {
        display: none;
    }
    /* - 禁用时边框占位元素样式 - */
    .input-group.is-disabled .border-gap::before { 
        background-color: #f5f7fa !important;
    }

    /* 常态激活样式 */
    .is-always-active .title1 {
        opacity: 0 !important;
        transform: translateY(-1.25rem) scale(0.75);
    }

    /* 常态激活并禁用时标签2的样式 */
    .input-group.is-disabled.is-always-active .title2 {
        color: #c0c4cc;
        transform: translateY(-1.25rem) scale(0.75);
    }

    /* 按钮组 */
    .btn-group { 
        position: absolute;
        top: 50%;
        right: 0.7rem;
        transform: translateY(-50%);

        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    /* 清除按钮 */
    .clear-btn { 
        width: 1.5rem;
        height: 1.5rem;

        border-radius: 50%;
        transform: none;
    }

    /* 清除按钮图标 */
    .clear-icon { 
        width: 100%;
        height: 100%;
        background-color: #D6DEEB;

        -webkit-mask-image: url("@/assets/icons/clear-icon.svg");
        mask-image: url("@/assets/icons/clear-icon.svg");

        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        mask-size: contain;

        transition: background-color 0.25s ease-in-out;
    }

    /* 鼠标悬停时清除按钮图标颜色 */
    .clear-btn:hover .clear-icon{ 
        background-color: #F44336;
    }

    /* 显示密码按钮 */
    .show-password-btn { 
        width: 1.5rem;
        height: 1.5rem;

        border-radius: 50%;
        transform: none;
    }

    /* 显示密码按钮图标 */
    .show-password-icon { 
        width: 100%;
        height: 100%;

        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        mask-size: contain;

        transition: background-color 0.25s ease-in-out;
    }

    /* 开眼图标 */
    .eye-open { 
        background-color: #D6DEEB;

        -webkit-mask-image: url("@/assets/icons/eye-open-icon.svg");
        mask-image: url("@/assets/icons/eye-open-icon.svg");
        
    }

    /* 闭眼图标 */
    .eye-close { 
        background-color: #D6DEEB;

        -webkit-mask-image: url("@/assets/icons/eye-close-icon.svg");
        mask-image: url("@/assets/icons/eye-close-icon.svg");
    }

    /* 鼠标悬停时显示密码按钮图标颜色 */
    .show-password-btn:hover .show-password-icon {
        background-color: #6191D3;
    }

    .btn-fade-enter-active, .btn-fade-leave-active { 
        transition: all 0.25s ease;
    }

    .btn-fade-enter-from, .btn-fade-leave-to {
        opacity: 0;
        transform: scale(0.8);
    }












    /* .input:focus + .title,
    .input:not(:placeholder-shown) + .title {
        transform: translateY(-1.25rem) scale(0.75);
        color: #6191D3;
        font-weight: 700;
    }  */
</style>