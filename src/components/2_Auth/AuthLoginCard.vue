<template>
    <div class="login-card">
        <router-link to="/PageHome" v-if="this.isMobile == true">
            <el-button 
                class="back"
                type="primary"
                text
            >
                ← 返回主页
            </el-button>
        </router-link>

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
            <el-radio-group
                class="radio-group"
                v-model="LoginForm.selectedRole"
            >
                <el-radio :label="0">家属</el-radio>
                <el-radio :label="3">老人</el-radio>
                <el-radio :label="2">服务人员</el-radio>
                <el-radio :label="1">管理员</el-radio>
            </el-radio-group>
        </div>
        <div class="form-row">
            <el-button
                class="login-btn"
                @click="handelLogin"
                type="primary"
                plain
                color="#6191D3"
                size="large"
            >
            登录
            </el-button>
        </div>
        <div class="form-row bottom-row">
            <router-link to="/PageRegister">
                <el-button
                    type="primary"
                    text
                >忘记密码</el-button>
            </router-link>
            <router-link to="/PageRegister">
                <el-button
                    type="primary"
                    text
                >前往注册</el-button>
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
        inject: ['isMobile'],
        setup() {
            const authStore = useAuthStore();
            return { authStore };
        },
        data() {
            return {
                LoginForm: {
                    email: '',
                    password: '',
                    selectedRole: 0,
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
                        role: this.LoginForm.selectedRole,
                    });
                    
                    const { userInfo, token } = res;
                    const activeRole = this.LoginForm.selectedRole;

                    this.authStore.login(userInfo, activeRole, token);

                    if (activeRole === 1) {
                        this.$message.success('管理员登录成功');
                        this.$router.push('/ManageUser');
                    } else if (activeRole === 2) {
                        this.$message.success('服务人员登录成功');
                        this.$router.push('/PageHome');
                    } else {
                        this.$message.success('用户登录成功');
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
    .login-card {
        width: 30rem;
        height: 40rem;
        box-sizing: border-box;
        
        background-color: rgba(255, 255, 255, 75%);
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
        gap: 10px;
    }

    .login-btn {
        width: 20rem;
        height: 3rem;

        box-sizing: border-box;
        border-radius: 0.5rem;
    }

    .bottom-row {
        margin-top: auto;
        margin-bottom: 10rem;
    }

    @media (max-width: 768px) {
        .login-card {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
        }
        .bottom-row {
            margin-top: 0;
        }
    }
</style>