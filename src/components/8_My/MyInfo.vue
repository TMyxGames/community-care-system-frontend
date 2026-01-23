<template>
    <div class="my-info-container">
        <label class="title">账户信息</label>
        <div class="form-row info-row">
            <el-upload
                class="upload"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="UpLoadAvatar"
            >
                <!-- <el-button type="primary" size="large" link>
                    更换头像
                </el-button> -->
                <img class="avatar" :src="$getFileUrl(userInfo.avatarUrl) || defaultAvatar" alt="用户头像" />
            </el-upload>
            <div class="cell id">
                <label class="info-label">ID:</label>
                <label class="user-id">{{ userInfo.id }}</label>
            </div>
            <div class="edit" v-if="isEditing">
                <div class="cell">
                    <label class="info-label">用户名</label>
                    <input class="info" type="text" :value="userInfo.username"/>
                </div>
                <div class="cell">
                    <label class="info-label">性别</label>
                    <el-select class="sex-select" v-model="editForm.sex" placeholder="请选择性别">
                        <el-option label="男" value="男" />
                        <el-option label="女" value="女" />
                    </el-select>
                </div>
                <el-button type="primary" @click="saveEdit">保存编辑</el-button>
                <el-button type="primary" @click="isEditing = false">取消保存</el-button>
            </div>
            <div class="display" v-else>
                <div class="cell">
                    <label class="info-label">用户名</label>
                    <input class="info" type="text" :value="userInfo.username"/>
                </div>
                <div class="cell">
                    <label class="info-label">性别</label>
                    <input class="info" type="text" :value="userInfo.sex"/>
                </div>
                <el-button type="primary" @click="startEdit">编辑资料</el-button>
            </div>
            

            

        </div>
        <!-- <div class="form-row"></div> -->
        <label class="title">账户安全</label>
    </div>
</template>

<script>
    // import InputBox1 from '../InputBox1.vue';
    import { useAuthStore } from '@/stores/auth';
    import defaultAvatar from '@/assets/兔兔.jpg';

    export default {
        name: 'MyInfo',
        components: {
            // InputBox1,
        },
        data() {
            return {
                defaultAvatar: defaultAvatar,
                isEditing: false,
                editForm: {
                    username: '',
                    sex: '',
                    password: '',
                },
            };
        },
        setup() {
            const authStore = useAuthStore();
            return { authStore };
        },
        computed: {
            userInfo() {
                return this.authStore.userInfo || {};
            },
        },
        methods: {
            startEdit() {
                this.editForm = {...this.userInfo}
                this.isEditing = true;
            },
            async saveEdit() { 
                try {
                    const res = await this.$http.post('/auth/upload/info', this.editForm);
                    if (res.status === 200) {
                        this.authStore.login(res.data);
                        this.isEditing = false;
                        this.$message.success("资料更新成功");
                    }
                } catch (error) {
                    this.$message.error("资料更新失败");
                }
            },
            // 上传头像
            async UpLoadAvatar(file) {
                if (!file || !file.raw) return;

                // 校验图片大小和格式 (可选)
                // const isLt2M = file.raw.size / 1024 / 1024 < 2;

                let formData = new FormData();
                formData.append('file', file.raw);
                formData.append('userId', this.userInfo.id);

                if (this.userInfo.avatarUrl) {
                    formData.append('oldUrl', this.userInfo.avatarUrl);
                }

                try {
                    const res = await this.$http.post('/auth/upload/avatar', formData);
                    const newAvatarUrl = res.data; // 获取新的头像URL
                    this.authStore.userInfo.avatarUrl = newAvatarUrl;
                    localStorage.setItem('userInfo', JSON.stringify(this.authStore.userInfo));
                    this.$message.success("头像上传成功");
                } catch (error) {
                    console.error(error);
                    this.$message.error("头像上传失败");
                }
            },
        },
    };
</script>

<style scoped>
    .my-info-container{
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        /* align-items: center; */

        gap: 1rem;
    }

    /* 标题 */
    .title {
        /* font-size: 36px; */
        font-size: clamp(1.5rem, 2vw, 2rem);
        font-weight: 700;
        margin-left: 1rem;

        position: relative;
    }

    /* 标题装饰线 */
    .title::after {
        content: "";
        height: clamp(1.8rem, 2.2vw, 2.2rem);
        width: 0.5rem;

        position: absolute;
        left: -1rem;
        top: 52%;
        transform: translateY(-50%);

        background-color: #ff2e63;

    }

    .form-row {
        width: 100%;
        height: auto;
        /* min-height: 10rem; */

        /* background-color: #6eb6ff; */

        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        gap: 0.5rem;
    }

    .info-row { 
        /* background-color: #6eb6ff; */
        flex-direction: column;
        align-items: center;
    }

    .info-form {
        width: 50rem;
        height: 100%;

        display: flex;
        gap: 0.5rem;

    }

    .avatar{
        width: 10rem;
        height: auto;
        box-sizing: border-box;

        border: 0.25rem solid #6eb6ff;
        border-radius: 50%;

        aspect-ratio: 1/1;
    }

    .upload {
        width: 10rem;
        height: 10rem;
        position: relative;

        aspect-ratio: 1/1;
    }

    /* .upload:hover::after {
        width: 100%;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
        border-radius: 50%;

        content: "点击上传头像";
        color: rgba(255, 255, 255);
        font-size: clamp(0.5rem, 1vw, 1rem);
        font-weight: 700;
        text-align: center;
        
        background-color: rgba(0, 0, 0, 0.25);

        position: absolute;
    } */

    .cell {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

    }

    .id {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        gap: 0.5rem;
    }

    .user-id {
        font-size: clamp(1rem, 2vw, 2rem);
        font-weight: 700;
    }

    .info-label {
        font-size: clamp(0.5rem, 1vw, 1rem);
        font-weight: 700;
    }

    .info {
        width: 15rem;
        height: 2.5rem;

        border: 0px;
        outline: none;
        /* background-color: transparent; */

        font-size: clamp(1rem, 2vw, 2rem);
        font-weight: 700;

    }

    .info:focus {
        border-bottom: 0.25rem solid #6eb6ff;
    }

    .sex-select { 
        width: 15rem;
        border: none;
    }
</style>
