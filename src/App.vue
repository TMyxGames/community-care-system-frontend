<template>
  <router-view/>
  <template v-if="authStore.isLoggedIn">
    <EmergencyCall/>
    <SafetyDialog/>
  </template>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch, provide } from 'vue';
  import { useAuthStore } from './stores/auth';
  import { useSocketStore } from './stores/socket';
  import { useLocationStore } from './stores/location';
  import AMapLoader from "@amap/amap-jsapi-loader";
  import SafetyDialog from './components/7_Security/Common/SafetyDialog.vue';
  import EmergencyCall from './components/7_Security/Common/EmergencyCall.vue';

  const authStore = useAuthStore();
  const socketStore = useSocketStore();
  const locationStore = useLocationStore();

  // 移动端判断变量
  const isMobile = ref(window.innerWidth < 768);

  // 监听窗口大小变化
  const updateSize = () => {
    isMobile.value = window.innerWidth < 768;
  };

  // 鉴定用户权限并初始化ws服务
  const initAllAppService = async () => {
    const token = localStorage.getItem('token');
    // 必须同时具备token和 userInfo.id才能初始化
    if (token && authStore.userInfo?.id) {
        console.log("鉴权通过");
        socketStore.initAllSocket();
    }
  };

  let locationTimer = null;
  // 开启定时定位上报
  const startLocationReporting = async () => {
    try {
        // 1. 即使不渲染地图，也要先 load API，确保 window.AMap 被注入
        const AMap = await AMapLoader.load({
            key: "28fa556174185bba89d841f3c448147d", // 必填
            version: "2.0",    // 建议 2.0
            plugins: ['AMap.Geolocation'], // 直接在这里声明插件
        });

        const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
        });

        // 每5秒获取一次位置
        locationTimer = setInterval(() => {
            geolocation.getCurrentPosition((status, result) => {
                if (status === 'complete') {
                    const { lng, lat } = result.position;
                    socketStore.sendLocation(lng, lat);
                    console.log(`[定时上报成功] 经度: ${lng}, 纬度: ${lat}`);
                } else {
                    console.error('定位失败，可能是未开启HTTPS或浏览器权限拒绝:', result.message);
                }
            });
        }, 5000);

    } catch (e) {
        console.error('高德地图加载失败:', e);
    }
  };

  // 停止定位上报
  const stopLocationReporting = () => {
    if (locationTimer) {
      clearInterval(locationTimer);
      locationTimer = null;
      console.log('已停止位置上报定时器');
    }
  };

  onMounted(() => {
    // 如果刷新后发现用户已经登录，立即初始化一次
    if (authStore.isLoggedIn) {
      console.log('检测到已登录状态，正在恢复ws连接...');
      initAllAppService();
      locationStore.loadMonitoringData();
    }


    window.addEventListener('resize', updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
    stopLocationReporting();
  });

  // 将窗口大小状态提供给所有子组件
  provide('isMobile', isMobile);

  watch(
    () => authStore.userInfo?.id, 
    (newId) => {
      if (newId) {
        initAllAppService();
        // 延迟执行，确保 WebSocket 已初始化并连接
        setTimeout(() => {
          startLocationReporting();
        }, 2000);
      } else {
        if (socketStore.isConnected) {
          socketStore.closeAllSocket();
        }
        stopLocationReporting();
      }
    }, 
  ), { immediate: true };

</script>

<style>
  /* 全局字体 */
  body, #app, button, input, select, textarea {
    font-family: 'HarmonyOS Sans SC';
    font-weight: 500;
    color: #132843;
  }
</style>

