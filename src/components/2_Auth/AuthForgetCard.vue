<template>
    <div class="forget-card">
        <router-link to="/PageHome" v-if="this.isMobile == true">
            <el-button 
                class="back"
                type="primary"
                text
            >
                ← 返回主页
            </el-button>
        </router-link>

        <h1>找回密码</h1>

        <div class="form-row" v-if="this.isMobile != true"></div>

        <div class="form-row">
            <InputBox1
                v-model="resetForm.email"
                title1="请输入邮箱"
                title2="邮箱"
                moduleWidth="20rem"
                type="email"
                :status="statusEmail"
                @blur="checkEmail"
            />
        </div>
        <div class="form-row">
            <InputBox1
                v-model="resetForm.captcha"
                title1="请输入验证码"
                title2="验证码"
                moduleWidth="14.5rem"
                type="text"
            />
            <el-button 
                class="get-code-btn"
                plain
                color="#6191D3"
                size="large"
                :disabled="isCodeSending || countdown > 0"
                :loading="isCodeSending"
                @click="sendCaptcha"
            >
                {{ countdown > 0 ? `${countdown}s后重新发送` : '获取验证码' }}
            </el-button>
        </div>

        <div class="form-row">
            <InputBox1
                v-model="resetForm.password1"
                title1="请输入密码"
                title2="密码"
                moduleWidth="20rem"
                type="password"
                @input="checkPassword"
                showPassword
            />
        </div>
        <div class="form-row">
            <InputBox1
                v-model="resetForm.password2"
                title1="请再次输入密码"
                title2="确认密码"
                moduleWidth="20rem"
                type="password"
                showPassword
                :status="statusPassword"
                @input="checkPassword"
                @blur="checkPassword"
                @focus="statusPassword = 'default'"
            />
        </div>
        <div class="form-row">
            <el-button
                class="submit-btn"
                @click="handelResetPwd"
                type="primary"
                plain
                color="#6191D3"
                size="large"
            >
            重置密码
            </el-button>

        </div>
        <div class="form-row bottom-row">
            <router-link to="/PageLogin">
                <el-button
                    type="primary"
                    text
                >有账号了？去登录</el-button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import InputBox1 from '../Common/InputBox1.vue'
    
    export default {
        name: 'AuthForgetCard',
        components: {
            InputBox1
        },
        inject: ['isMobile'],
        data() {
            return {
                resetForm: {
                    password1: '',
                    password2: '',
                    email: '',
                    captcha: '',
                },
                // 验证码相关
                isCodeSending: false,
                countdown: 0,
                timer: 0,

                statusPassword: 'default', //密码状态（改变样式）
                statusEmail: 'default', //邮箱状态（改变样式）
                isPasswordMatch: true, //密码一致状态
            }
        },
        methods: {
            async handelResetPwd() {
                const { password1, password2, email, captcha } = this.resetForm;
                if (!email || !captcha || !password1 || !password2) {
                    this.$message.error('请填写完整信息');
                    return;
                }

                if (password1 !== password2) {
                    this.statusPassword = 'danger';
                    this.$message.error('两次输入密码不一致');
                    return;
                }

                try {
                    const res = await this.$http.put('/auth/reset', {
                        password: password1,
                        email: email,
                        captcha: captcha,
                    });

                    this.$message.success('密码重置成功');
                    this.$router.push('/PageLogin');
                } catch (error) {
                    console.log("请求出错：", error);
                    this.$message.error('密码重置失败');
                }
            },
            async sendCaptcha() {
                if (!this.resetForm.email) {
                    this.$message.error('请填写邮箱');
                    return;
                }

                this.isCodeSending = true;
                try {
                    const res = await this.$http.post(`/auth/sendResetCaptcha?email=${this.resetForm.email}`);
                    this.$message.success('验证码已发送');

                    this.countdown = 60;
                    const timer = setInterval(() => { 
                        this.countdown--;
                        if (this.countdown <= 0) {
                            clearInterval(timer);
                        }
                    }, 1000);
                } catch (error) {
                    this.$message('发送验证码失败');
                } finally {
                    this.isCodeSending = false;
                }
            },

        }
    }
</script>

<style scoped>
    .forget-card {
        width: 30rem;
        height: 45rem;
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 75%);
        /* background-color: rgba(128, 128, 128, 0.75); */
        backdrop-filter: blur(10px);
        box-shadow: 0 0 50px rgba(0, 0, 0, 25%);
        border-radius: 15px;

        display: flex;
        flex-direction: column;
        /* gap: 20px; */
    }

    .back {
        position: absolute;
        top: 0.5rem;
        left: 0.25rem;
    }

    .form-row {
        width: 100%;
        height: 75px;

        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    .prompt {
        width: 100%;
        height: 50px;
        color: red;
        text-align: center;
    }

    .get-code-btn {
        width: 5rem;
        height: 3rem;

        box-sizing: border-box;
        border-radius: 0.5rem;
    }

    .submit-btn {
        width: 20rem;
        height: 3rem;

        box-sizing: border-box;
        border-radius: 0.5rem;
    }

    @media (max-width: 768px) {
        .regi-card {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
        }
        .message-row { 
            height: 1rem;
        }
        .bottom-row {
            margin-top: 0;
        }
    }
</style>