<template>
    <div class="my-info-container">
        <base-title>账户信息</base-title>
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
                    <label class="info-label">真实姓名</label>
                    <input class="info" type="text" :value="userInfo.realName"/>
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
                    <span class="info">
                        {{ userInfo.username }}
                    </span>
                </div>
                <div class="cell">
                    <label class="info-label">真实姓名</label>
                    <span class="info">
                        {{ userInfo.realName }}
                    </span>
                </div>
                <div class="cell">
                    <label class="info-label">性别</label>
                    <span class="info">
                        {{ userInfo.sex }}
                    </span>
                </div>
                <el-button type="primary" @click="startEdit">编辑资料</el-button>
            </div>
            

            

        </div>
        <!-- <div class="form-row"></div> -->
        <base-title>账户安全</base-title>
        <el-button type="warning" @click="pwdDialogVisible = true" :disabled="isEditing">
            修改密码
        </el-button>
    </div>

    <el-dialog
        v-model="pwdDialogVisible"
        title="修改密码"
        width="30rem"
        @closed="resetPwdForm"
    >
        <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef" label-width="100px">
            <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="pwdForm.oldPassword" type="password" show-password placeholder="请输入原密码" />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="请输入新密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="pwdForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="pwdDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitPassword" :loading="pwdLoading">确认修改</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
    import { ref, reactive, computed, watch, onMounted } from 'vue';
    import BaseTitle from '../Common/BaseTitle.vue';
    import { useAuthStore } from '@/stores/auth';
    import defaultAvatar from '@/assets/兔兔.jpg';
    import request from '@/utils/request';
    import { ElMessage } from 'element-plus';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const authStore = useAuthStore();

    const isEditing = ref(false);
    const pwdDialogVisible = ref(false);
    const pwdLoading = ref(false);
    const pwdFormRef = ref(null);

    const editForm = reactive({
        username: '',
        realName: '',
        sex: '',
        password: ''
    });

    const pwdForm = reactive({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const userInfo = computed(() => authStore.userInfo || {});
       
    // 开始编辑个人资料
    const startEdit = () => {
        Object.assign(editForm, userInfo.value);
        isEditing.value = true;
    };

    // 保存个人资料
    const saveEdit = async () => { 
        try {
            const res = await request.post('/auth/upload/info', editForm);
            if (res) {
                authStore.login(res, authStore.activeRole, authStore.token);
                isEditing.value = false;
                ElMessage.success("资料更新成功");
            }
        } catch (error) {
            ElMessage.error("资料更新失败");
        }
    };

    // 上传头像
    const UpLoadAvatar = async (file) => {
        if (!file || !file.raw) return;

        // 校验图片大小和格式
        // const isLt2M = file.raw.size / 1024 / 1024 < 2;

        let formData = new FormData();
        formData.append('file', file.raw);
        formData.append('userId', userInfo.id);

        if (userInfo.avatarUrl) {
            formData.append('oldUrl', userInfo.avatarUrl);
        }

        try {
            const res = await request.post('/auth/upload/avatar', formData);
            const newAvatarUrl = res; // 获取新的头像URL
            authStore.userInfo.avatarUrl = newAvatarUrl;
            localStorage.setItem('userInfo', JSON.stringify(authStore.userInfo));
            ElMessage.success("头像上传成功");
        } catch (error) {
            console.error(error);
            ElMessage.error("头像上传失败");
        }
    };

    // 校验两次密码是否一致
    const validateConfirmPassword = (rule, value, callback) => {
        if (value !== pwdForm.newPassword) {
            callback(new Error('两次输入的密码不一致'));
        } else {
            callback();
        }
    };

    const pwdRules = {
        oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
        ],
        confirmPassword: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: validateConfirmPassword, trigger: 'blur' }
        ]
    };

    // 重置表单
    const resetPwdForm = () => {
        if (pwdFormRef.value) pwdFormRef.value.resetFields();
    };

    // 提交修改
    const submitPassword = async() => {
        pwdFormRef.value.validate(async (valid) => {
            if (!valid) return;

            pwdLoading.value = true;
            try {
                await request.put('/auth/password', {
                    oldPassword: pwdForm.oldPassword,
                    newPassword: pwdForm.newPassword
                });

                ElMessage.success("密码修改成功，请重新登录");
                pwdDialogVisible.value = false;
                // 密码修改后强制退出登录
                setTimeout(() => {
                    authStore.logout();
                    router.push('/login');
                }, 1000);
                
            } catch (error) {
                console.log(error);
            } finally {
                pwdLoading.value = false;
            }
        });

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
