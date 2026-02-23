<template>
  <router-view/>
  <EmergencyCall/>
  <SafetyDialog/>
</template>

<script setup>
  import { onMounted, watch } from 'vue';
  import { useAuthStore } from './stores/auth';
  import { useSocketStore } from './stores/socket';
  import SafetyDialog from './components/7_Security/Common/SafetyDialog.vue';
  import EmergencyCall from './components/7_Security/Common/EmergencyCall.vue';

  const authStore = useAuthStore();
  const socketStore = useSocketStore();

  watch(
    () => authStore.userInfo?.id, 
    (newId) => {
      if (newId) {
        socketStore.initAllSocket();
      } else {
        socketStore.closeAllSocket();
      }
    }, 
    { immediate: true }
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

