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
        console.log("鉴权通过，初始化各项服务...");
        // 初始化所有ws服务
        socketStore.initAllSocket();
        // 获取并同步告警状态
        locationStore.loadMonitoringData();
        // 如果当前用户是老人，开启定时定位推送
        // id=37是测试用户，用于手动控制定位，不进行推送
        if (authStore.userInfo.role === 3 && authStore.userInfo.id !== 37) {
          startLocationReporting();
        }
    }
  };

  let locationTimer = null;
  const apiKey = import.meta.env.VITE_AMAP_API_KEY || '';
  // 定时推送位置
  const startLocationReporting = async () => {
    // 判断当前用户身份是否为老人
    if (authStore.userInfo.role !== 3) {
      console.log('当前用户身份非老人，无需上报位置');
      return;
    }
    // 防抖，如果已存在定时器则清除
    if (locationTimer) clearInterval(locationTimer);

    AMapLoader.load({
        key: apiKey,
        version: "2.0",
        plugins: ['AMap.Geolocation'],
    }).then((AMap) => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 开启高精度定位
        timeout: 10000, // 超过10秒停止定位
        useNative: true,
        convert: false,
        noIpLocate: 1, // 是否禁止IP定位。0:都用 1:手机上不用 2:PC上不用 3:都不用
        noGeoLocation: 0, // 是否禁止浏览器获取位置
        extensions: 'all'
      });
      // 立即执行一次，然后开启定时器，每10秒推送一次位置
      const report = () => {
          geolocation.getCurrentPosition((status, result) => {
              if (status === 'complete') {
                console.log('定位来源：', result.location_type);
                const { lng, lat } = result.position;
                socketStore.sendLocation(lng, lat);
                console.log(`[定时上报成功] 经度: ${lng}, 纬度: ${lat}`);
              }
          });
      };

      report();
      locationTimer = setInterval(report, 10000);
    })
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
    // 监听窗口大小变化
    window.addEventListener('resize', updateSize);
    // 如果刷新后发现用户已经登录，立即初始化一次
    if (authStore.isLoggedIn) {
      console.log('检测到已登录状态，正在恢复服务...');
      initAllAppService();
    }

    console.log(import.meta.env.VITE_AMAP_API_KEY);
    console.log(import.meta.env.VITE_AMAP_SEC_CODE);

  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
    stopLocationReporting();
  });

  // 将窗口大小状态提供给所有子组件
  provide('isMobile', isMobile);

  watch(
    () => authStore.userInfo?.id, 
    (loggedIn) => {
      if (loggedIn) {
        initAllAppService();
      } else {
        socketStore.closeAllSocket();
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

