<template>

    <div id="map-container" class="map-container"></div>

</template>

<script setup>
    import { onMounted, onUnmounted } from "vue";
    import AMapLoader from "@amap/amap-jsapi-loader";

    let map = null;

    onMounted(() => {
        window._AMapSecurityConfig = {
            securityJsCode: "98431c9e945c81b827dbc2adfe096468",
        };
        AMapLoader.load({
            key: "28fa556174185bba89d841f3c448147d",
            version: "2.0",
            plugins: ["AMap.Scale"],
        })
            .then((AMap) => {
                map = new AMap.Map("map-container", {
                    // 设置地图容器id
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                    center: [116.397428, 39.90923], // 初始化地图中心点位置
                });
            })
            .catch((e) => {
                console.log(e);
            });
    });

    onUnmounted(() => {
        map?.destroy();
    });
</script>

<style scoped>
    .map-container { 
        padding: 0px;
        margin: 0px;
        position: relative;
        overflow: hidden;

        border-radius: 1rem;
    }

</style>