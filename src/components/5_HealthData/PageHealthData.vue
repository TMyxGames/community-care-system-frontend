<template>
    <div class="healthData-container" v-if="authStore.isLoggedIn">
        <glass-layer class="choose_bar thin" v-if="authStore.activeRole !== 3">
            <!-- 自己的选项 -->
            <div class="option" v-if="authStore.activeRole === 3">
                <img class="avatar" 
                    :src="$getFileUrl(userInfo.avatarUrl) || defaultAvatar " 
                    alt="用户头像"
                    @click="handleUserChange(authStore.userInfo?.id)"
                />
                <label class="name">{{ authStore.userInfo.username }}</label>
            </div>
            <!-- 绑定的选项 -->
            <div class="option" 
                v-for="option in healthStore.boundList"
                :key="option.id"
            >
                <img class="avatar" 
                    :src="$getFileUrl(option.avatarUrl) || defaultAvatar " 
                    alt="用户头像"
                    
                    @click="handleUserChange(option.id)"
                />
                <label class="name">{{ option.username }}</label>
            </div>
            <!-- 添加绑定按钮 -->
            <button class="add_option" @click="goToBind"/>
            <!-- 点击添加绑定时弹出对话框 -->
            <el-dialog title="添加绑定" v-model="dialogVisible" append-to-body>
                <div>
                    <span>您将作为</span>
                    <b>{{ roleName }}</b>
                    <span>向对方发起绑定请求</span>
                </div>
                <el-form :model="bindForm">
                    <el-form-item label="用户" label-width="80px">
                        <el-input v-model="keyword" placeholder="请搜索想要绑定的用户" width="10px"></el-input>
                        <el-button type="primary" @click="searchUser">搜索</el-button>
                    </el-form-item>
                </el-form>
                <div class="search-result">
                    <search-user-item
                        v-for="user in result"
                        :key="user.id"
                        :userInfo="user"
                        @send="sendRequest"
                    />
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">返回</el-button>
                    </span>
                </template>
            </el-dialog>
        </glass-layer>

        <HealthDataLayout></HealthDataLayout>
    </div>
    <div class="healthData-container" v-else>
        <span>请先登录</span>
    </div>

</template>

<script>
    import { useHealthStore } from '@/stores/health';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';
    import MidOverlay from '../Common/MidOverlay.vue';
    import GlassLayer from '../Common/GlassLayer.vue';
    import HealthDataLayout from './Common/HealthDataLayout.vue';
    import SearchUserItem from './Common/SearchUserItem.vue';
    import defaultAvatar from '@/assets/兔兔.jpg';

    export default {
        name: 'PageHealthData',
        components: {
            HealthDataLayout,
            GlassLayer,
            MidOverlay,
            SearchUserItem,
        },
        setup() {
            const router = useRouter();
            const healthStore = useHealthStore();
            const authStore = useAuthStore();
            return { router, healthStore, authStore };
        },
        data() {
            return {
                defaultAvatar: defaultAvatar,
                dialogVisible: false,
                keyword: '',
                result: [],
                relation: 0,
                bindForm: {
                    userId: '',
                    bindId: '',
                },
            }
        },
        computed: {
            // 根据用户role返回身份
            roleName() {
                const roleName = {
                    0: '家属',
                    1: '家属',
                    2: '家属',
                    3: '老人',
                };
                return roleName[this.authStore.userInfo.role] || '未知身份';
            },
        },
        created() {
            if (this.authStore.isLoggedIn) {
                this.healthStore.getBoundList();
            }
        },
        methods: {
            // 切换用户
            handleUserChange(val) {
                this.healthStore.setUserId(val);
            },
            // 跳转绑定页面
            goToBind() {
                this.dialogVisible = true;
            },
            async searchUser() {
                try {
                    const res = await this.$http.get("/user/search", {
                        params: {
                            keyword: this.keyword,
                        }
                    });

                    this.result = res;
                } catch (error) {
                    this.$message.error('请求失败');
                }
            },
            async sendRequest(targetUser) { 
                try {
                    const res = await this.$http.post('/message/bind/send', null, {
                        params:{
                            toId: targetUser.id,
                            relation: this.relation,
                        }
                    });
                    console.log("请求已发送", res);
                    this.$message.success("请求已发送");
                } catch (error) {
                    console.log("请求出现问题", error);
                }
                
            },
        },
    }
</script>

<style scoped>
    .healthData-container {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2.5rem;
    }

    .choose_bar {
        width: 100%;
        height: auto;
        max-width: 100rem;

        font-size: 28px;
        font-weight: bold;
        color: #132843;

        display: flex;
        gap: 1rem;
    }

    .option {
        width: auto;
        height: auto;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .name {
        font-size: 1rem;
    }

    .avatar {
        width: 5rem;
        height: 5rem;
        box-sizing: border-box;

        border-radius: 50%;
        border: 0.25rem solid rgba(255, 255, 255);

        /* cursor: pointer; */
        user-select: none;
    }

    .add_option {
        width: 5rem;
        height: 5rem;
        box-sizing: border-box;

        border-radius: 50%;
        border: 0.25rem solid rgba(255, 255, 255);

        /* cursor: pointer; */
        user-select: none;
    }

</style>