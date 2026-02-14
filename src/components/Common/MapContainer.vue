<template>

    <div id="map-container" class="map-container"></div>

</template>

<script setup>
    import { onMounted, onUnmounted, defineExpose, ref, watch, nextTick } from "vue";
    import { useUserStore } from "@/stores/user";
    import { useAreaStore } from "@/stores/area";
    import { useLocationStore } from "@/stores/location";
    import AMapLoader from "@amap/amap-jsapi-loader";
    import { getFullUrl } from "@/utils/config";
    import defaultAvatar from "@/assets/兔兔.jpg";

    let map = null;
    let polygons = []; // 地图上的区域对象
    let mouseTool = null; // 鼠标工具
    let currentPolygon = null; // 当前绘制的图形
    let AMapInstance = null;
    const markerMap = new Map();
    const userStore = useUserStore();
    const areaStore = useAreaStore();
    const locationStore = useLocationStore();


    // 分类存储Marker的对象
    const markerMapContainer = {
        staff: new Map(),
        security: new Map(),
    };
    const getMapInstance = () => map;

    const updateMarkers = (dataList) => { 
        if(!map || !window.AMap) return;

        const mode = locationStore.currentMode;
        const targetMap = markerMapContainer[mode];

        const currentIds = new Set();

        dataList.forEach(item => { 
            if (!item.lng || !item.lat) return;
            currentIds.add(item.id);

            const position = [item.lng, item.lat]; // Marker的经纬度

            if (targetMap.has(item.id)) { 
                // 如果存在，则更新位置
                targetMap.get(item.id).setPosition(position);
            } else { 
                // 如果不存在，则调用高德地图的创建Marker方法来创建一个
                const marker = new window.AMap.Marker({
                    position: position,
                    map: map,
                    content: `<div class="custom-marker">
                                <img class="marker-img" src="${getFullUrl(item.avatarUrl) || defaultAvatar}"/>
                            </div>`,
                    // offset: new window.AMap.Pixel(-(config.size / 2), -config.size),
                });
                targetMap.set(item.id, marker);
            }
        });
        // 清除不在列表中的人员标记
        targetMap.forEach((marker, id) => { 
            if (!currentIds.has(id)) { 
                marker.setMap(null);
                targetMap.delete(id);
            }
        });
    };
    // 监听位置列表的更新
    watch(
        () => locationStore.activeMarkers,
        (newList) => { 
            if (map && window.AMap) {
                console.log("监听到数据变化，执行绘制", newList.length);
                updateMarkers(newList);
            }
        },
        { deep: true, immediate: true },
    );
    // 监听聚焦
    watch(
        () => locationStore.focusId, 
        (id) => {
            if (!id) return;
            
            // 从已经画好的 MarkerMap 中找到对应的实例
            const marker = markerMap.get(id);
            if (marker && map) {
                // 让地图平滑飞过去，并缩放到合适的级别
                map.setZoomAndCenter(18, marker.getPosition());
            }
        }
    );


    // 检测人员是否在区域内
    const checkInArea = (point, areaItem) => { 
        if (!window.AMap || !window.AMap.GeometryUtil) return true;
        
        try {
            const path = JSON.parse(areaItem.scopePath);
            const polygonPath = path.map(p => [p.lng, p.lat]);

            const isIn = window.AMap.GeometryUtil.isPointInPolygon(point, polygonPath);

            return isIn;
        } catch (error) { 
            console.error("区域校验失败", error);
            return true;
        }
    };

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

        polygons.forEach(p => map.remove(p));
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

    watch(
        () => areaStore.areaList,
        (newList) => { 
            if (newList && newList.length > 0) { 
                existingAreaDisplay(newList);
            }
        },
        { deep: true, immediate: true },
    );

    // 聚焦服务区域
    const focusOnArea = (areaId) => {
        const target = polygons.find(p => p.getExtData().id === areaId);
        if (target && map) {
            map.setFitView(target, false, [60, 60, 60, 60], 18); 
        }
    };

    // 聚焦服务人员
    const focusOnStaff = (staff) => {
        if (!staff.id || !map) return;

        updateMarkers([staff], locationStore.currentMode === 'staff'); 

        map.setZoomAndCenter(17, [staff.lng, staff.lat]);
    };

    // 一个通用聚焦方法
    const fitView = () => { 
        if (map) { 
            map.setFitView(null, true, [60, 60, 60, 60]);
        }
    };

    onMounted(async () => {
        window._AMapSecurityConfig = {
            securityJsCode: "98431c9e945c81b827dbc2adfe096468",
        };
        AMapLoader.load({
            key: "28fa556174185bba89d841f3c448147d",
            version: "2.0",
            plugins: ["AMap.Scale", "AMap.MouseTool"],
        })
            .then((AMap) => {
                AMapInstance = AMap;
                map = new AMap.Map("map-container", {
                    // 设置地图容器id
                    viewMode: "3D", // 是否为3D地图模式
                    zoom: 11, // 初始化地图级别
                });

                map.on('complete', () => { 
                    if (areaStore.areaList && areaStore.areaList.length > 0) {
                        existingAreaDisplay(areaStore.areaList);
                    }
                    if (locationStore.activeMarkers.length > 0) {
                        updateMarkers(locationStore.activeMarkers);
                    }
                })

                if (userStore.allStaff && userStore.allStaff.length > 0) {
                    updateMarkers(userStore.allStaff);
                }
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
        focusOnStaff,
        fitView,
        
    });

    onUnmounted(() => {
        // 遍历清理分类容器中的所有 Marker
        Object.values(markerMapContainer).forEach(specMap => {
            specMap.forEach(m => m.setMap(null));
            specMap.clear();
        });
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

    :deep(.custom-marker) {
        position: relative;
        cursor: pointer;
    }
    :deep(.marker-label) {
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 2px 8px;
        border: 1px solid #409EFF;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    :deep(.marker-img) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #409EFF;
    background-color: #fff;
    object-fit: cover;
}

</style>