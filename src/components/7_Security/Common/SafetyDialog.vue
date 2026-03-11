<template>
    <el-dialog
        v-model="locationStore.showSafetyDialog"
        :title="dialogTitle"
        width="40rem"
        center
        :close-on-click-modal="false"
        custom-class="safety-dialog"
        style="border-radius: 12px; overflow: hidden;"
        append-to-body
        z-index="3000"
    >
        <div class="alarm-container">
            <div v-if="authStore.userInfo.role === 3" class="elder-view">
                <div v-if="locationStore.dialogStage === 1">
                    <i class="el-icon-warning" style="color: #E6A23C; font-size: 50px;"></i>
                    <h3>您已离开安全区域</h3>
                    <p>系统已向家属发送邮件提醒，请您尽快返回安全区域内。</p>
                </div>
                <div v-else-if="locationStore.dialogStage === 2">
                    <i class="el-icon-message-solid" style="color: #F56C6C; font-size: 50px;"></i>
                    <h3>您仍在安全区域外</h3>
                    <p>家属是否知晓您的行程？若5分钟后仍未返回，将触发紧急呼叫。</p>
                </div>
            </div>

            <div v-else-if="authStore.userInfo.role !== 3" class="family-view">
                <i class="el-icon-error" style="color: #F56C6C; font-size: 50px;"></i>
                <h3>老人安全告警</h3>
                <p v-if="locationStore.dialogStage === 1">
                    老人已离开安全区域，请尽快处理。
                </p>
                <p v-if="locationStore.dialogStage === 2">
                    老人长时间处于区域外且未返回，您是否知晓此情况？
                </p>
                <div v-if="locationStore.dialogStage === 2" class="action-area">
                    <p>您可以为老人设置临时离开时间（期间不再提醒）：</p>
                    <el-select 
                        v-model="leaveMinutes" placeholder="请选择时长" style="width: 100%; margin-bottom: 10px;"
                        :teleported="true" popper-class="emergency-select-popper"
                    >
                        <el-option label="30 分钟" :value="30" />
                        <el-option label="1 小时" :value="60" />
                        <el-option label="2 小时" :value="120" />
                    </el-select>
                    <!-- <el-button type="danger" @click="handleImmediateCall">紧急呼叫</el-button> -->
                </div>
            </div>
        </div>
        <template #footer>
            <el-button type="success" 
                @click="handleConfirmSafe" 
                v-if="authStore.userInfo.role !== 3 && locationStore.dialogStage === 2"
            >
                确认安全并设置静默
            </el-button>
            <el-button type="primary" @click="locationStore.showSafetyDialog = false">
                我知道了
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useLocationStore } from '@/stores/location';
    import { ElMessage } from 'element-plus';
    import request from '@/utils/request';
    
    const authStore = useAuthStore();
    const locationStore = useLocationStore();
    const leaveMinutes = ref(30);

    // 弹窗标题
    const dialogTitle = computed(() => {
        return authStore.userInfo.role === 3 ? '安全提醒' : '紧急风险告知';
    });

    // 处理临时离开
    const handleConfirmSafe = async() => {
        if (!locationStore.currentAlarmingElderId) return;

        try {
            await request.post('/security/temporary-leave', {
                elderId: locationStore.currentAlarmingElderId,
                minutes: leaveMinutes.value
            });
            ElMessage.success('设置成功');
        } catch (e) {
            ElMessage.error('操作失败');
        }
    };

    const handleImmediateCall = () => {
        // TODO: 立即触发紧急呼叫
    };

</script>

<style scoped>
    .alarm-content { 
        text-align: center; 
        padding: 10px; 
    }

    .main-tip { 
        font-size: 18px; 
        font-weight: bold; 
        margin: 15px 0; 
    }

    .sub-tip { 
        color: #606266; 
        line-height: 1.6; 
    }

    .warning-tip { 
        color: #F56C6C; 
        font-weight: bold; 
        margin-top: 10px; 
    }
</style>