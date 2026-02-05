<template>
    <div class="healthData-container" v-if="authStore.isLoggedIn">
        <glass-layer class="choose_bar thin">
            <!-- 自己的选项 -->
            <div class="option">
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
                <label class="name">{{ option.elderId }}</label>
            </div>
            <!-- 添加绑定按钮 -->
            <button class="add_option" @click="goToBind"/>
            <!-- 点击添加绑定时弹出对话框 -->
            <el-dialog title="添加绑定" v-model="dialogVisible" append-to-body>
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
                bindForm: {
                    userId: '',
                    bindId: '',
                },
            }
        },
        computed: {
            currentElderName() {
                const current = this.healthStore.boundList.find(e => e.id === this.healthStore.currentSelection);
                return current ? (current.remark || current.username) : '未选择';
            },
            userInfo() {
                return this.authStore.userInfo || {};
            },
        },
        created() {
            // 将当前登录用户的id赋值给myId
            // 如果myId存在，则获取该用户的绑定列表，并设置给boundList
            const myId = this.authStore.userInfo?.id;
            if (myId) {
                this.healthStore.getBoundList(myId);
            }
        },
        beforeUnmount() {
            // this.healthStore.$reset();
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
                    const response = await this.$http.get("/user/search", {
                        params: {
                            keyword: this.keyword,
                            userId: this.authStore.userInfo.id,
                        }
                    });

                    const res = response.data;

                    if (res.code === 200) {
                        this.result = res.data;
                    } else {
                        this.$message.error('请求失败');
                    }
                } catch (error) {
                    this.$message.error('请求失败');
                }
            },
            async sendRequest(targetUser) { 
                try {
                    const res = await this.$http.post('/message/send/bind', null, {
                        params:{
                            userId: this.authStore.userInfo.id,
                            toId: targetUser.id,
                        }
                    });
                    if (res.data.code === 200) {
                        console.log("请求已发送", res);
                    } else {
                        console.error("请求失败", res.data.msg);
                    }
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