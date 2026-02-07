<template>
    <!-- 未来改动 -->
    <!-- 注册后给按钮增加禁用状态,直到出现反馈为止，防止用户多次点击 -->
    <div id="regi-card">
        <h1>注 册</h1>
        <div class="form-row"></div>
        <div class="form-row">
            <InputBox1
                v-model="regiForm.username"
                title1="请输入用户名"
                title2="用户名"
                moduleWidth="20rem"
                moduleHeight="3rem"
                type="text"
                clearable
            />
        </div>
        <div class="form-row">
            <InputBox1
                v-model="regiForm.password1"
                title1="请输入密码"
                title2="密码"
                moduleWidth="20rem"
                type="password"
                @input="checkPassword"
                clearable
                showPassword
            />
        </div>
        <div class="form-row">
            <InputBox1
                v-model="regiForm.password2"
                title1="请再次输入密码"
                title2="确认密码"
                moduleWidth="20rem"
                type="password"
                :status="statusPassword"
                @input="checkPassword"
                @blur="checkPassword"
                @focus="statusPassword = 'default'"
            />
        </div>
        <div class="form-row">
            <InputBox1
                v-model="regiForm.email"
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
                v-model="regiForm.captcha"
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
            <el-checkbox v-model="regiForm.isAdmin">管理员</el-checkbox>
        </div>
        <div class="form-row">
            <label class="prompt">
                {{ promptMessage }}
            </label>
        </div>
        <div class="form-row">
            <el-button
                class="submit-btn"
                @click="handelRegister"
                type="primary"
                plain
                color="#6191D3"
                size="large"
            >
            立即注册
            </el-button>

            <!-- <button class="submit-btn" @click="handelRegister">立即注册</button> -->
        </div>
        <div class="form-row" id="bottom-row">
            <router-link to="/PageLogin">
                <button>有账号了？去登录</button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import InputBox1 from '../Common/InputBox1.vue'
    
    export default {
        name: 'LoginCard',
        components: {
            InputBox1
        },
        data() {
            return {
                regiForm: {
                    username: '',
                    password1: '',
                    password2: '',
                    email: '',
                    isAdmin: false,
                    captcha: '',
                },
                // 验证码相关
                isCodeSending: false,
                countdown: 0,
                timer: 0,

                statusPassword: 'default', //密码状态（改变样式）
                statusEmail: 'default', //邮箱状态（改变样式）
                promptMessage: '', //提示信息
                isPasswordMatch: true, //密码一致状态
            }
        },
        methods: {
            async handelRegister() {
                this.checkPassword();

                if (!this.isPasswordMatch) {
                    this.promptMessage = '两次输入密码不一致';
                    return;
                }

                const { username, password1, password2, email, isAdmin, captcha } = this.regiForm;
                if (!username || !password1 || !password2) {
                    this.promptMessage = '请填写完整信息';
                    return;
                }

                this.promptMessage = '';
                try {
                    const res = await this.$http.post('/auth/register', {
                        username: username,
                        password: password1,
                        email: email,
                        isAdmin: isAdmin,
                        captcha: captcha,
                    });
                    if (res.code === 200) {
                        this.promptMessage = '注册成功!';
                        this.$router.push('/PageLogin');
                    }
                } catch (error) {
                    console.log("请求出错：", error);
                    this.$message.error('注册失败');
                }
            },
            checkPassword() {
                if (this.regiForm.password2 === '') {
                    this.statusPassword = 'default';
                    this.isPasswordMatch = true;
                    return;
                }
                if (this.regiForm.password2 === this.regiForm.password1) {
                    this.statusPassword = 'success';
                    this.isPasswordMatch = true;
                    if (this.promptMessage === '两次输入密码不一致') {
                        this.promptMessage = '';
                    }
                } else {
                    this.statusPassword = 'danger';
                    this.isPasswordMatch = false;
                    this.promptMessage = '两次输入密码不一致';
                }
            },
            checkUsername() {
                if (this.regiForm.username === '') {
                    this.promptMessage = '请填写用户名';
                    return;
                }
                this.promptMessage = '';
            
                // TODO: 检查用户名是否合法
            },
            async sendCaptcha() {
                if (!this.regiForm.email) {
                    this.promptMessage = '请填写邮箱';
                    return;
                }

                this.isCodeSending = true;
                try {
                    const res = await this.$http.post(`/auth/sendCaptcha?email=${this.regiForm.email}`);

                    this.promptMessage = '';
                    this.$message.success('验证码已发送');

                    this.countdown = 60;
                    const timer = setInterval(() => { 
                        this.countdown--;
                        if (this.countdown <= 0) {
                            clearInterval(timer);
                        }
                    }, 1000);
                } catch (error) {
                    this.promptMessage = '发送验证码失败';
                } finally {
                    this.isCodeSending = false;
                }
            },

        }
    }
</script>

<style scoped>
    #regi-card {
        width: 500px;
        height: 900px;
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

    #bottom-row {
        margin-top: auto;
    }
</style>