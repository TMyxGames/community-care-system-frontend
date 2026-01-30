<template>

    <div id="map-container" class="map-container"></div>

</template>

<script setup>
    import { onMounted, onUnmounted, defineExpose, ref } from "vue";
    import AMapLoader from "@amap/amap-jsapi-loader";

    let map = null;
    let polygons = []; // 地图上的区域对象
    let mouseTool = null; // 鼠标工具
    let currentPolygon = null; // 当前绘制的图形

    const getMapInstance = () => map;

    // 绘制图形
    const drawPolygon = () => { 
        if (!mouseTool) {
            mouseTool = new AMap.MouseTool(map);
        }
        mouseTool.polygon({
            strokeColor: "#fc5c9c",
            strokeOpacity: 0.25,
            strokeWeight: 5,
            fillColor: "#fccde2",
            fillOpacity: 0.25,
        });
        mouseTool.on("draw", (e) => { 
            currentPolygon = e.obj; // 获取路径坐标数组
            mouseTool.close(false); // 关闭鼠标工具
            console.log("绘制完成");
        });
    };

    // 获取绘制的图形
    const getPath = () => { 
        if (mouseTool) {
            mouseTool.close(false);
        }
        if (currentPolygon) { 
            return currentPolygon.getPath();
        }
        return null;
    };

    // 清除当前绘制
    const clearDraw = () => { 
        if (mouseTool) {
            mouseTool.close(true); // 清除当前绘制状态
        }
        if (currentPolygon) {
            map.remove(currentPolygon); // 清除绘制完成的图形
            currentPolygon = null;
        }
    };

    // 清空地图
    const clearAll = () => { 
        clearDraw(); // 清除绘制状态
        if (map) {
            map.clearMap(); // 清空所有图形
        }
    };

    // 关闭鼠标工具（取消绘制）
    const closeTool = () => { 
        if (mouseTool) {
            mouseTool.close(true); // 清除绘制状态
        }
    };

    // 显示已有的区域
    const existingAreaDisplay = (areaList) => { 
        if (!map) return;
        map.clearMap();
        polygons = [];

        areaList.forEach((item) => { 
            const path = JSON.parse(item.scopePath);
            const polygon = new window.AMap.Polygon({
                path: path,
                strokeColor: "#FF33FF",
                strokeOpacity: 0.25,
                strokeWeight: 5,
                fillColor: "#1791fc",
                fillOpacity: 0.25,
                extData: item,
            });
            map.add(polygon);
            polygons.push(polygon); // 添加到数组中
        });
        map.setFitView();
    };

    // 聚焦(已弃用)
    // const focusOnArea = (center) => { 
    //     if (map && center.lng && center.lat) {
    //         map.setCenter([center.lng, center.lat]);
    //         map.setZoom(14);
    //     }
    // };

    // 聚焦
    const focusOnArea = (areaId) => {
        const target = polygons.find(p => p.getExtData().id === areaId);
        if (target && map) {
            map.setFitView(target, false, [60, 60, 60, 60], 18); 
        }
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
        getMapInstance,
        drawPolygon,
        getPath,
        clearAll,
        clearDraw,
        closeTool,
        existingAreaDisplay,
        focusOnArea,
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