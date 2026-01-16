<template>  
    <!-- 背景 -->
    <global-background
      autoTimeChange
      class="background"
    />
  
    <!-- 头部 -->
    <GlobalHeader class="header"></GlobalHeader>
  
    <!-- 页面 -->
    <div class="main-page">
  
      <router-view></router-view>
  
      <h2>🚧页面正在施工中🚧</h2>
    </div>
</template>
  
<script>
  import GlobalBackground from '@/components/Common/GlobalBackground.vue'
  import GlobalHeader from '@/components/Common/Header/GlobalHeader.vue'

    export default {
      name: 'MainPage',
      components: {
        GlobalBackground,
        GlobalHeader,
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
    /* text-align: center; */
    color: #132843;

    display: flex;
    flex-direction: column;
    align-items: center;
  }
      
</style>