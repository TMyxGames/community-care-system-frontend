<template>
  <router-view></router-view>
</template>

<script setup>
  import { onMounted, watch } from 'vue';
  import { useAuthStore } from './stores/auth';
  import { useSocketStore } from './stores/socket';

  const authStore = useAuthStore();
  const socketStore = useSocketStore();

  watch(
    () => authStore.userInfo?.id, 
    (newId) => {
      if (newId) {
        socketStore.initSocket();
      } else {
        socketStore.closeSocket();
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

