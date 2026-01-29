<template>

    <div id="map-container" class="map-container"></div>

</template>

<script setup>
    import { onMounted, onUnmounted, defineExpose } from "vue";
    import AMapLoader from "@amap/amap-jsapi-loader";

    let map = null;
    let mouseTool = null; // 鼠标工具
    let currentPloygon = null;

    const getMapInstance = () => map;

    const drawPolygon = () => { 
        if (!mouseTool) {
            mouseTool = new AMap.MouseTool(map);
        }
        mouseTool.polygon({
            strokeColor: "#FF33FF",
            strokeOpacity: 0.2,
            strokeWeight: 6,
            fillColor: "#1791fc",
            fillOpacity: 0.35,
        });
        mouseTool.on("draw", (e) => { 
            currentPloygon = e.obj; // 获取路径坐标数组
        });
    };

    const finishDrawing = () => { 
        if (mouseTool) {
            mouseTool.close(false);
        }
        if (currentPloygon) { 
            return currentPloygon.getPath();
        }
        return null;
    };

    const clearMap = () => { 
        if (mouseTool) mouseTool.close(true); // 清除绘制
        currentPloygon = null;
    };

    onMounted(() => {
        window._AMapSecurityConfig = {
            securityJsCode: "98431c9e945c81b827dbc2adfe096468",
        };
        AMapLoader.load({
            key: "28fa556174185bba89d841f3c448147d",
            version: "2.0",
            plugins: ["AMap.Scale", "AMap.MouseTool"],
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

    defineExpose({
        drawPolygon,
        finishDrawing,
        clearMap,
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