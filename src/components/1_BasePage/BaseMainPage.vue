<template>  
    <!-- 背景 -->
    <global-background
      autoTimeChange
      class="background"
    />
  
    <!-- 头部 -->
    <GlobalHeader class="header"></GlobalHeader>
  
    <!-- 页面 -->
    <mid-overlay class="main-page">
  
      <router-view></router-view>
  
      <h2>🚧页面正在施工中🚧</h2>
    </mid-overlay>
</template>
  
<script>
  import GlobalBackground from '@/components/Common/GlobalBackground.vue'
  import GlobalHeader from '@/components/Common/Header/GlobalHeader.vue'
  import MidOverlay from '@/components/Common/MidOverlay.vue'

    export default {
      name: 'MainPage',
      components: {
        GlobalBackground,
        GlobalHeader,
        MidOverlay,
      },
      data: function() {
        return {

        }
      },
      methods: {

      },
    }
</script>
  
<style scoped>
  
  .main-page {
    font-family: "HarmonyOS Sans SC";
    color: #132843;

    margin-top: 7rem;
  }
      
</style>