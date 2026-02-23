<template>
    <transition name="fade">
        <div v-if="locationStore.dialogStage === 3" class="emergency-overlay">
            <div class="overlay-content">
                <div class="status-header">
                    <div class="pulse-dot"></div>
                    <span>紧急求助通话中</span>
                </div>

                <div class="avatar-container">
                    <div class="ripple"></div>
                    <div class="ripple delay-1"></div>
                    <div class="ripple delay-2"></div>

                    <el-avatar :size="120" :src="targetAvatar" />

                </div>

                <div class="call-info">
                    <h2>{{ targetName }}</h2>
                    <p class="location-text">
                        <i class="el-icon-location"></i> 系统已实时定位您的位置
                    </p>
                    <div class="timer">{{ formattedTime }}</div>
                </div>

                <div class="controls">
                    <div class="control-btn hangup" @click="handleHangup">
                        <i class="el-icon-phone-outline"></i>
                        <span>挂断</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
    import { useLocationStore } from '@/stores/location';
    import { ElMessage } from 'element-plus';

    const locationStore = useLocationStore();
    const timer = ref(0);
    let interval = null;

    const targetName = "智慧养老服务中心";
    const targetAvatar = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"; // 示例头像

    // 格式化时间
    const formattedTime = computed(() => {
        const m = Math.floor(timer.value / 60).toString().padStart(2, '0');
        const s = (timer.value % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    });

    // 监听进入第3告警阶段开始计时
    watch(() => locationStore.dialogStage, (newStage) => {
        if (newStage === 3) {
            startTimer();
            playDialTone();
        } else {
            stopTimer();
        }
    });

    // 播放提示音
    const playDialTone = () => {
        // 模拟语音
        const msg = new SpeechSynthesisUtterance("您好，这里是智慧养老服务中心，我们已收到您的紧急求助，请您耐心等待。");
        msg.lang = 'zh-CN';
        window.speechSynthesis.speak(msg);
    };

    // 启动计时器
    const startTimer = () => {
        timer.value = 0;
        interval = setInterval(() => { timer.value++ }, 1000);
    };

    // 停止计时器
    const stopTimer = () => {
        if (interval) clearInterval(interval);
    };

    // 挂断通话后重置
    const handleHangup = async () => {
        const elderId = locationStore.currentAlarmingElderId;
        
        if (elderId) {
            try {
                await request.post('/security/clear-alarm', { elderId });
            } catch (error) {
                console.error("重置状态失败", error);
                locationStore.dialogStage = 0;
                locationStore.showSafetyDialog = false;
            }
        } else {
            locationStore.dialogStage = 0;
        }
    };

</script>

<style scoped>
    .emergency-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(15px); /* 背景模糊核心代码 */
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }

    .status-header {
        position: absolute;
        top: 60px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        color: #ff4d4f;
    }

    .pulse-dot {
        width: 12px;
        height: 12px;
        background: #ff4d4f;
        border-radius: 50%;
        animation: flash 1s infinite;
    }

    .avatar-container {
        position: relative;
        margin-bottom: 40px;
    }

    /* 波纹动画 */
    .ripple {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 120px;
        height: 120px;
        border: 2px solid #ff4d4f;
        border-radius: 50%;
        animation: ripple 3s linear infinite;
        opacity: 0;
    }
    .delay-1 { animation-delay: 1s; }
    .delay-2 { animation-delay: 2s; }

    .call-info { text-align: center; }
    .timer { font-size: 32px; font-weight: bold; margin-top: 10px; font-family: 'HarmonyOS Sans SC', Courier, monospace; }
    .location-text { color: #aaa; margin-top: 5px; }

    .controls {
        position: absolute;
        bottom: 80px;
    }

    .control-btn.hangup {
        width: 70px;
        height: 70px;
        background: #ff4d4f;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .control-btn.hangup:active { transform: scale(0.9); }
    .control-btn i { font-size: 30px; transform: rotate(135deg); }
    .control-btn span { font-size: 12px; margin-top: 4px; }

    @keyframes ripple {
        0% { width: 120px; height: 120px; opacity: 0.5; }
        100% { width: 350px; height: 350px; opacity: 0; }
    }
    @keyframes flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }

    .fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
    .fade-enter-from, .fade-leave-to { opacity: 0; }
</style>