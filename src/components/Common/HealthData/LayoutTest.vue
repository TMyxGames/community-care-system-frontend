<template>
  <div class="dashboard-container">
    <div class="health-grid">
      <div class="card big-card">
        <div class="card-content">2x2 大卡片</div>
      </div>

      <div class="card wide-card">
        <div class="card-content">2x1 个人信息</div>
      </div>

      <div class="card small-card" v-for="i in 2" :key="i">
        <div class="card-content">1x1 数据图表 {{i}}</div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'LayoutTest',
      components: {

      },
      data() {
        return {
            i: 1,
        }
      }
    }
</script>

<style scoped>
    .dashboard-container {
    width: 100%;
    padding: 2vw;
    box-sizing: border-box;
    background-color: #f0f2f5;
    min-height: 100vh;
    }

    .health-grid {
    display: grid;
    /* 核心：定义 4 列，每列等宽 */
    grid-template-columns: repeat(4, 1fr);
    /* 核心：开启“稠密”布局，自动填补空隙 */
    grid-auto-flow: row dense;
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    }

    /* 所有卡片的基础样式 */
    .card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    }

    /* 2x2 卡片：它的比例天然就是 1:1，因为它横竖都跨越了相同数量的格子和间距 */
    .big-card {
    grid-column: span 2;
    grid-row: span 2;
    aspect-ratio: 1 / 1; 
    }

    /* 2x1 卡片：跨越 2 列 1 行 */
    .wide-card {
    grid-column: span 2;
    grid-row: span 1;
    /* 关键：在 Grid 中，2x1 的真实物理比例。
        因为宽度包含了 1 个 gap，而高度没有。
        设置为 2 / 1 是理论值，如果内容不多，这是最稳妥的。 */
    aspect-ratio: 2 / 1; 
    }

    /* 1x1 卡片 */
    .small-card {
    grid-column: span 1;
    aspect-ratio: 1 / 1;
    }

    /* --- 响应式断点控制 --- */

    /* 平板模式：改为 2 列 */
    @media (max-width: 1024px) {
    .health-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
    .big-card, .wide-card {
        grid-column: span 2; /* 此时都占满一行 */
    }
    }

    /* 手机模式：改为 1 列 */
    @media (max-width: 600px) {
    .health-grid {
        grid-template-columns: 1fr;
    }
    .card {
        grid-column: span 1 !important;
        aspect-ratio: auto !important; /* 手机端不再强制比例，由内容撑开 */
        min-height: 150px;
        padding: 20px;
    }
    }
</style>