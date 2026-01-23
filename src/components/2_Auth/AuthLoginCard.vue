<!-- 未来改动 -->
<!-- 增加员工登录选项 -->
<template>
    <div id="login-card">
        <h1>登 录</h1>
        <div class="form-row"></div>
        <div class="form-row">
            <InputBox1
                v-model="LoginForm.email"
                title1="请输入邮箱"
                title2="邮箱"
                moduleWidth="20rem"
                type="text"
            />
        </div>
        <div class="form-row">
            <InputBox1
                v-model="LoginForm.password"
                title1="请输入密码"
                title2="密码"
                moduleWidth="20rem"
                type="password"
                showPassword
            />
        </div>
        <div class="form-row">
            <el-checkbox v-model="LoginForm.isAdmin">管理员登录</el-checkbox>
        </div>
        <div class="form-row">
            <el-button
                class="submit-btn"
                @click="handelLogin"
                type="primary"
                plain
                color="#6191D3"
                size="large"
            >
            登录
            </el-button>

            <!-- <button class="submit-btn" @click="handelRegister">立即注册</button> -->
        </div>
        <div class="form-row bottom-row">
            <router-link to="/PageRegister">
                <button>前往注册</button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import { useAuthStore } from '@/stores/auth';
    import InputBox1 from '../Common/InputBox1.vue'
    
    export default {
        name: 'LoginCard',
        components: {
            InputBox1
        },
        setup() {
            const authStore = useAuthStore();
            return { authStore };
        },
        data() {
            return {
                LoginForm: {
                    email: '',
                    password: '',
                    isAdmin: false,
                },
            }
        },
        methods: {
            async handelLogin() { 
                if (!this.LoginForm.email || !this.LoginForm.password) {
                    return this.$message.warning('请填写完整信息');
                }

                try {
                    const res = await this.$http.post('/auth/login', {
                        email: this.LoginForm.email,
                        password: this.LoginForm.password,
                        isAdmin: this.LoginForm.isAdmin,
                    });
                    
                    const user = res.data;

                    if (this.LoginForm.isAdmin) {
                        if (!user.isAdmin) {
                            this.$message.error('该账号无管理员权限');
                            return;
                        }
                        this.authStore.login(user);
                        this.$message.success('管理员登录成功');
                        this.$router.push('/ManageUser');
                    } else {
                        this.authStore.login(user);
                        this.$message.success('登录成功');
                        this.$router.push('/PageHome');
                    }
                } catch (error) { 
                    this.$message.error('登录失败');
                }
            },
        },
    }
</script>

<style scoped>
    #login-card {
        width: 500px;
        height: 700px;
        box-sizing: border-box;
        
        background-color: rgba(255, 255, 255, 75%);
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
        gap: 10px;
    }

    .bottom-row {
        margin-top: auto;
    }
</style>