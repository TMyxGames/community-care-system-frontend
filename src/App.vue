<template>
  <router-view/>
  <template v-if="authStore.isLoggedIn">
    <EmergencyCall/>
    <SafetyDialog/>
  </template>
</template>

<script setup>
  import { onMounted, watch } from 'vue';
  import { useAuthStore } from './stores/auth';
  import { useSocketStore } from './stores/socket';
  import { useLocationStore } from './stores/location';
  import SafetyDialog from './components/7_Security/Common/SafetyDialog.vue';
  import EmergencyCall from './components/7_Security/Common/EmergencyCall.vue';

  const authStore = useAuthStore();
  const socketStore = useSocketStore();
  const locationStore = useLocationStore();

  // 初始化服务
  const initAllAppService = async () => {
    const token = localStorage.getItem('token');
    // 必须同时具备token和 userInfo.id才能初始化
    if (token && authStore.userInfo?.id) {
        console.log("鉴权通过");
        socketStore.initAllSocket();
        // locationStore.loadMonitoringData();
    }
};

  onMounted(() => {
    // 如果刷新后发现用户已经登录，立即初始化一次
    if (authStore.isLoggedIn) {
      console.log('检测到已登录状态，正在恢复ws连接...');
      initAllAppService();
    }
  });

  watch(
    () => authStore.userInfo?.id, 
    (newId) => {
      if (newId) {
        initAllAppService();
      } else {
        if (socketStore.isConnected) {
          socketStore.closeAllSocket();
        }
      }
    }, 
  );

</script>

<style>
  /* 全局字体 */
  body, #app, button, input, select, textarea {
    font-family: 'HarmonyOS Sans SC';
    font-weight: 500;
    color: #132843;
  }
</style>

